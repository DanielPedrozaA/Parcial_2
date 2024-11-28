import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity/clase.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-error';

@Injectable()
export class ClaseService {
    constructor(
        @InjectRepository(ClaseEntity)
        private readonly claseRepository: Repository<ClaseEntity>,
    ) { }

    async crearClase(claseData: Partial<ClaseEntity>): Promise<ClaseEntity> {
        if (claseData.codigo.length !== 10) {
            throw new BusinessLogicException('El código de la clase debe tener exactamente 10 caracteres.', BusinessError.BAD_REQUEST);
        }

        const clase = this.claseRepository.create(claseData);
        return await this.claseRepository.save(clase);
    }

    async findClaseById(id: number): Promise<ClaseEntity> {
        const clase = await this.claseRepository.findOne({ where: { id } });

        if (!clase) {
            throw new BusinessLogicException(`Clase con ID ${id} no encontrada.`, BusinessError.NOT_FOUND);
        }

        return clase;
    }
}
