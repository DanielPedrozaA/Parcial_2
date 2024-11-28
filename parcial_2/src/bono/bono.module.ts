import { Module } from '@nestjs/common';
import { BonoService } from './bono.service';
import { BonoEntity } from './bono.entity/bono.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuario/usuario.entity/usuario.entity';
import { ClaseEntity } from 'src/clase/clase.entity/clase.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { ClaseModule } from 'src/clase/clase.module';
import { BonoController } from './bono.controller';


@Module({
  imports: [TypeOrmModule.forFeature([BonoEntity, UsuarioEntity, ClaseEntity]), UsuarioModule, ClaseModule],
  providers: [BonoService],
  controllers: [BonoController],
})
export class BonoModule { }
