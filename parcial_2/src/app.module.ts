import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { BonoModule } from './bono/bono.module';
import { ClaseModule } from './clase/clase.module';
import { UsuarioEntity } from './usuario/usuario.entity/usuario.entity';
import { BonoEntity } from './bono/bono.entity/bono.entity';
import { ClaseEntity } from './clase/clase.entity/clase.entity';

@Module({
  imports: [UsuarioModule, BonoModule, ClaseModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '7659',
      database: 'Parcial2',
      entities: [UsuarioEntity, BonoEntity, ClaseEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }