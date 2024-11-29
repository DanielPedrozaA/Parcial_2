import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/business-error';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<UsuarioEntity>;

  const seedDatabase = async () => {
    await repository.clear();
    for (let i = 0; i < 3; i++) {
      await repository.save({
        cedula: faker.number.int({ min: 100000, max: 999999 }),
        nombre: faker.person.firstName(),
        grupoInvestigacion: i % 2 === 0 ? 'TICSW' : 'IMAGINE',
        extension: faker.number.int({ min: 10000000, max: 99999999 }),
        rol: i % 2 === 0 ? 'Profesor' : 'Decana',
      });
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearUsuario', () => {
    it('Crear usuario válido con rol Profesor (positivo)', async () => {
      const usuarioData: Partial<UsuarioEntity> = {
        cedula: faker.number.int({ min: 100000, max: 999999 }),
        nombre: faker.person.firstName(),
        grupoInvestigacion: 'TICSW',
        extension: faker.number.int({ min: 10000000, max: 99999999 }),
        rol: 'Profesor',
      };

      const usuario = await service.crearUsuario(usuarioData);
      expect(usuario).toHaveProperty('id');
      expect(usuario.nombre).toBe(usuarioData.nombre);
    });

    it('Grupo de investigación no es válido (negativo)', async () => {
      const usuarioData: Partial<UsuarioEntity> = {
        cedula: faker.number.int({ min: 100000, max: 999999 }),
        nombre: faker.person.firstName(),
        grupoInvestigacion: 'INVALIDO',
        extension: faker.number.int({ min: 10000000, max: 99999999 }),
        rol: 'Profesor',
      };

      try {
        await service.crearUsuario(usuarioData);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('El grupo de investigación debe ser (TICSW, IMAGINE o COMIT).');
      }
    });
  });

  describe('findUsuarioById', () => {
    it('Usuario válido por su ID (positivo)', async () => {
      const usuario = await repository.save({
        cedula: faker.number.int({ min: 100000, max: 999999 }),
        nombre: faker.person.firstName(),
        grupoInvestigacion: 'TICSW',
        extension: faker.number.int({ min: 10000000, max: 99999999 }),
        rol: 'Profesor',
      });

      const foundUsuario = await service.findUsuarioById(usuario.id);
      expect(foundUsuario).toBeDefined();
      expect(foundUsuario.id).toEqual(usuario.id);
    });

    it('Usuario no existe (negativo)', async () => {
      try {
        await service.findUsuarioById(0);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('Usuario con ID 0 no encontrado.');
      }
    });
  });

  describe('eliminarUsuario', () => {
    it('Eliminar un usuario válido sin bonos ni rol Decana (positivo)', async () => {
      const usuario = await repository.save({
        cedula: faker.number.int({ min: 100000, max: 999999 }),
        nombre: faker.person.firstName(),
        grupoInvestigacion: 'TICSW',
        extension: faker.number.int({ min: 10000000, max: 99999999 }),
        rol: 'Profesor',
      });

      await service.eliminarUsuario(usuario.id);

      const foundUsuario = await repository.findOne({ where: { id: usuario.id } });
      expect(foundUsuario).toBeNull();
    });

    it('Usuario tiene el rol Decana (negativo)', async () => {
      const usuario = await repository.save({
        cedula: faker.number.int({ min: 100000, max: 999999 }),
        nombre: faker.person.firstName(),
        grupoInvestigacion: 'TICSW',
        extension: faker.number.int({ min: 10000000, max: 99999999 }),
        rol: 'Decana',
      });

      try {
        await service.eliminarUsuario(usuario.id);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('No se puede eliminar a un usuario con rol Decana.');
      }
    });

    it('Usuario tiene bonos asociados (negativo)', async () => {
      const usuario = await repository.save({
        cedula: faker.number.int({ min: 100000, max: 999999 }),
        nombre: faker.person.firstName(),
        grupoInvestigacion: 'TICSW',
        extension: faker.number.int({ min: 10000000, max: 99999999 }),
        rol: 'Profesor',
      });

      usuario.bonos = [{ id: faker.number.int() } as any];
      await repository.save(usuario);

      try {
        await service.eliminarUsuario(usuario.id);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('No se puede eliminar un usuario con bonos.');
      }
    });
  });
});
