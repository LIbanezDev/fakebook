import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Image } from './image.entity';


@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 400 })
  description: string;

  @Column({ type: 'datetime' })
  bornDate: Date;

  @OneToMany(() => Image, i => i.user)
  images: Image[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt;

  @DeleteDateColumn()
  deletedAt: Date;

  @Index()
  @Column({ type: 'int' })
  credentialId;
}