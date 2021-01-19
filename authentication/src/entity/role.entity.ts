import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 40 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

}