import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';
import { BonoEntity } from '../../bono/bono.entity/bono.entity';

@Entity()
export class ClaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: Number

    @Column()
    nombre: String

    @Column()
    codigo: String

    @Column()
    creditos: number

    @ManyToOne(() => UsuarioEntity, (usuario) => usuario.bonos)
    usuario: UsuarioEntity;

    @OneToMany(() => BonoEntity, (bono) => bono.clase)
    bonos: BonoEntity[];
}

