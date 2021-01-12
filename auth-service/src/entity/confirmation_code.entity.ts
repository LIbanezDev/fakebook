import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ConfirmationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'numeric' })
  userId: number;

  @Index()
  @Column({ type: 'numeric' })
  code: number;

  @CreateDateColumn()
  createdAt: Date;
}
