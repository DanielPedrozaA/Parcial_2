import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { BonoEntity } from 'src/bono/bono.entity/bono.entity';
import { ClaseEntity } from 'src/clase/clase.entity/clase.entity';

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

    @Column({ type: 'enum', enum: ['Profesor', 'Decana'] })
    rol: 'Profesor' | 'Decana';

    @ManyToOne(() => UsuarioEntity, (usuario) => usuario.id)
    jefe: UsuarioEntity;

    @OneToMany(() => BonoEntity, (bono) => bono.usuario)
    bonos: BonoEntity[];

    @OneToMany(() => ClaseEntity, (clase) => clase.usuario)
    clase: ClaseEntity[];
}

