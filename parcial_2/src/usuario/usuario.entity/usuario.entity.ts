import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ClaseEntity } from '../../clase/clase.entity/clase.entity';
import { BonoEntity } from '../../bono/bono.entity/bono.entity';

@Entity()
export class UsuarioEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    cedula: number;

    @Column()
    nombre: string;

    @Column()
    grupoInvestigacion: string;

    @Column()
    extension: number;

    @Column()
    rol: string;

    @ManyToOne(() => UsuarioEntity, (usuario) => usuario.id)
    jefe: UsuarioEntity;

    @OneToMany(() => BonoEntity, (bono) => bono.usuario)
    bonos: BonoEntity[];

    @OneToMany(() => ClaseEntity, (clase) => clase.usuario)
    clase: ClaseEntity[];
}

