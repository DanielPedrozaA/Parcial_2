import { Test, TestingModule } from '@nestjs/testing';
import { ClaseService } from './clase.service';
import { ClaseEntity } from './clase.entity/clase.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/business-error';

describe('ClaseService', () => {
  let service: ClaseService;
  let repository: Repository<ClaseEntity>;

  const seedDatabase = async () => {
    await repository.clear();
    for (let i = 0; i < 3; i++) {
      await repository.save({
        nombre: faker.commerce.department(),
        codigo: faker.string.alphanumeric(10),
        creditos: faker.number.int({ min: 1, max: 10 }),
      });
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClaseService],
    }).compile();

    service = module.get<ClaseService>(ClaseService);
    repository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearClase', () => {
    it('Clase válida (positivo)', async () => {
      const claseData: Partial<ClaseEntity> = {
        nombre: faker.commerce.department(),
        codigo: faker.string.alphanumeric(10),
        creditos: faker.number.int({ min: 1, max: 10 }),
      };

      const clase = await service.crearClase(claseData);
      expect(clase).toHaveProperty('id');
      expect(clase.nombre).toBe(claseData.nombre);
    });

    it('Código no tiene 10 caracteres (negativo)', async () => {
      const claseData: Partial<ClaseEntity> = {
        nombre: faker.commerce.department(),
        codigo: faker.string.alphanumeric(9),
        creditos: faker.number.int({ min: 1, max: 10 }),
      };

      try {
        await service.crearClase(claseData);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('El código de la clase debe tener exactamente 10 caracteres.');
      }
    });
  });

  describe('findClaseById', () => {
    it('Clase válida por su ID (positivo)', async () => {
      const clase = await repository.save({
        nombre: faker.commerce.department(),
        codigo: faker.string.alphanumeric(10),
        creditos: faker.number.int({ min: 1, max: 10 }),
      });

      const foundClase = await service.findClaseById(clase.id as number);
      expect(foundClase).toBeDefined();
      expect(foundClase.id).toEqual(clase.id);
    });

    it('Clase no existe (negativo)', async () => {
      try {
        await service.findClaseById(0);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('Clase con ID 0 no encontrada.');
      }
    });
  });
});
