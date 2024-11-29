import { Controller, Post, Get, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity/usuario.entity';

@Controller('usuarios')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) { }

    @Post()
    async crearUsuario(@Body() usuarioData: Partial<UsuarioEntity>) {
        try {
            return await this.usuarioService.crearUsuario(usuarioData);
        } catch (error) {
            if (error.message) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Error al crear el usuario', HttpStatus.INTERNAL_SERVER_ERROR,);
        }
    }

    @Get(':id')
    async obtenerUsuario(@Param('id') id: number) {
        try {
            return await this.usuarioService.findUsuarioById(id);
        } catch (error) {
            if (error.message) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            throw new HttpException('Error al obtener el usuario', HttpStatus.INTERNAL_SERVER_ERROR,);
        }
    }

    @Delete(':id')
    async eliminarUsuario(@Param('id') id: number) {
        try {
            await this.usuarioService.eliminarUsuario(id);
            return { message: `Usuario con ID ${id} eliminado con éxito` };
        } catch (error) {
            if (error.message) {
                throw new HttpException(error.message, HttpStatus.PRECONDITION_FAILED);
            }
            throw new HttpException('Error al eliminar el usuario', HttpStatus.INTERNAL_SERVER_ERROR,);
        }
    }
}
