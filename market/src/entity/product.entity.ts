import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Index()
  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'varchar', length: 700 })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}