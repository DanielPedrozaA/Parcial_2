import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
/* Añadir los imports de las entidades*/

@Module({
  imports: [/*Modulos van aca con ,*/
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '7659',
      database: 'Parcial2',
      entities: [/*Entidades*/],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }