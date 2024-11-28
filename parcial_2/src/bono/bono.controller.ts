import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { BonoService } from './bono.service';
import { BonoEntity } from './bono.entity/bono.entity';

@Controller('bonos')
export class BonoController {
    constructor(private readonly bonoService: BonoService) { }

    @Post()
    async crearBono(bonoData: Partial<BonoEntity>, usuarioId: number): Promise<BonoEntity> {
        return await this.bonoService.crearBono(bonoData, usuarioId);
    }

    @Get(':codigo')
    async findBonoByCodigo(@Param('codigo') codigo: string): Promise<BonoEntity[]> {
        return await this.bonoService.findBonoByCodigo(codigo);
    }

    @Get('usuario/:userID')
    async findAllBonosByUsuario(@Param('userID') userID: number): Promise<BonoEntity[]> {
        return await this.bonoService.findAllBonosByUsuario(userID);
    }

    @Delete(':id')
    async deleteBono(@Param('id') id: number): Promise<void> {
        return await this.bonoService.deleteBono(id);
    }
}
