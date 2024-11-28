import { Module } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { ClaseEntity } from './clase.entity/clase.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseController } from './clase.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClaseEntity])],
  providers: [ClaseService],
  controllers: [ClaseController]
})
export class ClaseModule { }
