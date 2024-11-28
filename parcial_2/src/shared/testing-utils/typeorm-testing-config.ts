import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [/*Entidades*/],
        synchronize: true,
        keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([/*Entidades*/]),
];