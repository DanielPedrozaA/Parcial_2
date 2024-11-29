import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-error';
import { BonoEntity } from '../bono/bono.entity/bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';

@Injectable()
export class BonoService {
    constructor(
        @InjectRepository(BonoEntity)
        private readonly bonoRepository: Repository<BonoEntity>,

        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,

        @InjectRepository(ClaseEntity)
        private readonly claseRepository: Repository<ClaseEntity>
    ) { }

    async crearBono(bonoData: Partial<BonoEntity>, usuarioId: number): Promise<BonoEntity> {
        if (!bonoData.monto || bonoData.monto <= 0) {
            throw new BusinessLogicException('El monto del bono debe ser un valor positivo.', BusinessError.BAD_REQUEST);
        }

        const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
        if (!usuario || usuario.rol !== 'Profesor') {
            throw new BusinessLogicException('El bono solo puede ser asignado a usuarios con el rol de Profesor.', BusinessError.BAD_REQUEST);
        }

        const bono = this.bonoRepository.create({ ...bonoData, usuario });
        return await this.bonoRepository.save(bono);
    }

    async findBonoByCodigo(codigo: string): Promise<BonoEntity[]> {

        const clase = await this.claseRepository.findOne({ where: { codigo }, relations: ['bonos'], });

        if (!clase) {
            throw new BusinessLogicException(`Clase con código ${codigo} no encontrada.`, BusinessError.NOT_FOUND);
        }
        return clase.bonos;
    }

    async findAllBonosByUsuario(userId: number): Promise<BonoEntity[]> {
        const bonos = await this.bonoRepository.find({ where: { usuario: { id: userId } } });
        return bonos;
    }

    async deleteBono(id: number): Promise<void> {
        const bono = await this.bonoRepository.findOne({ where: { id } });
        if (!bono) {
            throw new BusinessLogicException(`Bono con ID ${id} no encontrado.`, BusinessError.NOT_FOUND);
        }
        if (bono.calificacion > 4) {
            throw new BusinessLogicException('No se puede eliminar un bono con calificación mayor a 4.', BusinessError.PRECONDITION_FAILED);
        }
        await this.bonoRepository.remove(bono);
    }
}
