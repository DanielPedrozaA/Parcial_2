import { Controller, Post, Get, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { ClaseEntity } from './clase.entity/clase.entity';

@Controller('clases')
export class ClaseController {
    constructor(private readonly claseService: ClaseService) { }

    @Post()
    async crearClase(@Body() claseData: Partial<ClaseEntity>) {
        try {
            return await this.claseService.crearClase(claseData);
        } catch (error) {
            if (error.message) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Error al crear la clase', HttpStatus.INTERNAL_SERVER_ERROR,);
        }
    }

    @Get(':id')
    async obtenerClase(@Param('id') id: number) {
        try {
            return await this.claseService.findClaseById(id);
        } catch (error) {
            if (error.message) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            throw new HttpException('Error al obtener la clase', HttpStatus.INTERNAL_SERVER_ERROR,);
        }
    }
}
