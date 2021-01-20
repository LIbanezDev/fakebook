import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'imagesTypes' })
export class ImagesTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Image, i => i.type)
  images: Image[];
}

@Entity({ name: 'images' })
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  path: string;


  @ManyToOne(() => ImagesTypes, iT => iT.images)
  type: ImagesTypes;

  @ManyToOne(() => User, u => u.images)
  user: User;
}