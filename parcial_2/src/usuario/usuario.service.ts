import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-error';
import { UsuarioEntity } from './usuario.entity/usuario.entity';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,
    ) { }

    async crearUsuario(usuarioData: Partial<UsuarioEntity>): Promise<UsuarioEntity> {
        if (!['Profesor', 'Decana'].includes(usuarioData.rol)) {
            throw new BusinessLogicException('El rol debe ser "Profesor" o "Decana".', BusinessError.BAD_REQUEST);
        }

        if (usuarioData.rol === 'Profesor') {
            if (!['TICSW', 'IMAGINE', 'COMIT'].includes(usuarioData.grupoInvestigacion)) {
                throw new BusinessLogicException('El grupo de investigación debe ser (TICSW, IMAGINE o COMIT).', BusinessError.BAD_REQUEST);
            }
        } else if (usuarioData.rol === 'Decana') {
            if (usuarioData.extension.toString().length !== 8) {
                throw new BusinessLogicException('El número de extensión debe tener 8 dígitos.', BusinessError.BAD_REQUEST);
            }
        }

        const usuario = this.usuarioRepository.create(usuarioData);
        return await this.usuarioRepository.save(usuario);
    }

    async findUsuarioById(id: number): Promise<UsuarioEntity> {
        const usuario = await this.usuarioRepository.findOne({ where: { id }, relations: ['bonos'] });
        if (!usuario) {
            throw new BusinessLogicException(`Usuario con ID ${id} no encontrado.`, BusinessError.NOT_FOUND);
        }
        return usuario;
    }

    async eliminarUsuario(id: number): Promise<void> {
        const usuario = await this.findUsuarioById(id);

        if (usuario.rol === 'Decana') {
            throw new BusinessLogicException('No se puede eliminar a un usuario con rol Decana.', BusinessError.PRECONDITION_FAILED);
        }

        if (usuario.bonos && usuario.bonos.length > 0) {
            throw new BusinessLogicException('No se puede eliminar un usuario con bonos.', BusinessError.PRECONDITION_FAILED);
        }

        await this.usuarioRepository.remove(usuario);
    }
}
