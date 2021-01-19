import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Credential } from './credential.entity';


@Entity()
export class AuthType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 40 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Credential, c => c.authType)
  credentials: Credential[];
}