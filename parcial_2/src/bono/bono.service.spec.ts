import { Test, TestingModule } from '@nestjs/testing';
import { BonoService } from './bono.service';
import { BonoEntity } from './bono.entity/bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/business-error';

describe('BonoService', () => {
  let service: BonoService;
  let bonoRepository: Repository<BonoEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let claseRepository: Repository<ClaseEntity>;

  const seedDatabase = async () => {
    await bonoRepository.clear();
    await usuarioRepository.clear();
    await claseRepository.clear();

    const usuario = await usuarioRepository.save({
      cedula: faker.number.int({ min: 100000, max: 999999 }),
      nombre: faker.person.firstName(),
      grupoInvestigacion: 'TICSW',
      extension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Profesor',
    });

    const clase = await claseRepository.save({
      nombre: faker.string.alphanumeric(10),
      codigo: 'CLASS12345',
      creditos: 3,
    });

    await bonoRepository.save({
      monto: 1500,
      calificacion: 4,
      palabraClave: 'BONO_VALIDO',
      usuario,
      clase,
    });

    for (let i = 0; i < 2; i++) {
      await bonoRepository.save({
        monto: faker.number.int({ min: 1000, max: 5000 }),
        calificacion: faker.number.int({ min: 1, max: 3 }),
        palabraClave: faker.string.alphanumeric(10),
        usuario,
        clase,
      });
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BonoService],
    }).compile();

    service = module.get<BonoService>(BonoService);
    bonoRepository = module.get<Repository<BonoEntity>>(getRepositoryToken(BonoEntity));
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    claseRepository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearBono', () => {
    it('Bono válido para un usuario con rol Profesor (positivo)', async () => {
      const usuario = await usuarioRepository.findOneBy({ rol: 'Profesor' });
      const bonoData: Partial<BonoEntity> = {
        monto: 2000,
        calificacion: 5,
        palabraClave: 'EXAMPLE',
      };

      const bono = await service.crearBono(bonoData, usuario.id);
      expect(bono).toHaveProperty('id');
      expect(bono.monto).toEqual(bonoData.monto);
    });

    it('Monto es negativo o cero (negativo)', async () => {
      const usuario = await usuarioRepository.findOneBy({ rol: 'Profesor' });
      const bonoData: Partial<BonoEntity> = {
        monto: 0,
        calificacion: 3,
        palabraClave: 'EXAMPLE',
      };

      try {
        await service.crearBono(bonoData, usuario.id);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('El monto del bono debe ser un valor positivo.');
      }
    });

    it('Usuario no tiene rol Profesor (negativo)', async () => {
      const usuario = usuarioRepository.create({
        cedula: faker.number.int(),
        nombre: faker.person.firstName(),
        grupoInvestigacion: 'TICSW',
        extension: faker.number.int(),
        rol: 'Decana',
      });
      await usuarioRepository.save(usuario);

      const bonoData: Partial<BonoEntity> = {
        monto: 2000,
        calificacion: 5,
        palabraClave: 'EXAMPLE',
      };

      try {
        await service.crearBono(bonoData, usuario.id);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('El bono solo puede ser asignado a usuarios con el rol de Profesor.');
      }
    });
  });

  describe('findBonoByCodigo', () => {
    it('Bonos asociados a una clase por código (positivo)', async () => {
      const bonos = await service.findBonoByCodigo('CLASS12345');
      expect(bonos).toHaveLength(3);
    });

    it('Clase no existe (negativo)', async () => {
      try {
        await service.findBonoByCodigo('INVALID_CODE');
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('Clase con código INVALID_CODE no encontrada.');
      }
    });
  });

  describe('findAllBonosByUsuario', () => {
    it('Todos los bonos asociados a un usuario (positivo)', async () => {
      const usuario = await usuarioRepository.findOneBy({ rol: 'Profesor' });
      const bonos = await service.findAllBonosByUsuario(usuario.id);
      expect(bonos).toHaveLength(3);
    });
  });

  describe('deleteBono', () => {
    it('Eliminar un bono válido (positivo)', async () => {
      const bono = await bonoRepository.findOneBy({ calificacion: 4 });
      await service.deleteBono(bono.id);
      const deletedBono = await bonoRepository.findOneBy({ id: bono.id });
      expect(deletedBono).toBeNull();
    });

    it('Bono no existe (negativo)', async () => {
      try {
        await service.deleteBono(999);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('Bono con ID 999 no encontrado.');
      }
    });

    it('Calificación mayor a 4 (negativo)', async () => {
      const bono = await bonoRepository.save({
        monto: 1000,
        calificacion: 5,
        palabraClave: 'BONO5',
        usuario: await usuarioRepository.findOneBy({ rol: 'Profesor' }),
        clase: await claseRepository.findOneBy({ codigo: 'CLASS12345' }),
      });

      try {
        await service.deleteBono(bono.id);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('No se puede eliminar un bono con calificación mayor a 4.');
      }
    });
  });
});
