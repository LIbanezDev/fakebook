import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Credential } from './credential.entity';
import { IConfirmationCode } from '../interfaces/entity.interface';

@Entity()
export class ConfirmationCode implements IConfirmationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Credential)
  @JoinColumn()
  credential: Credential;

  @Index()
  @Column({ type: 'numeric' })
  code: number;

  @CreateDateColumn()
  createdAt: Date;
}
