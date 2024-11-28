import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UsuarioEntity } from 'src/usuario/usuario.entity/usuario.entity';
import { ClaseEntity } from 'src/clase/clase.entity/clase.entity';

@Entity('bono')
export class BonoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    monto: number;

    @Column()
    calificacion: number;

    @Column()
    palabraClave: string;

    @ManyToOne(() => UsuarioEntity, (usuario) => usuario.bonos)
    usuario: UsuarioEntity;

    @ManyToOne(() => ClaseEntity, (clase) => clase.bonos)
    clase: ClaseEntity;

}
