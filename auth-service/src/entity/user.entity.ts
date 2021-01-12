import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserInterface } from '../interfaces/user.interface';
import * as crypto from 'crypto';

@Entity({ name: 'users' })
export class User implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  bornDate!: Date;

  @Column({ default: '', length: 500 })
  description: string;

  @Column({ default: false })
  google: boolean;

  @Column({ default: false })
  github: boolean;

  @Column({ length: 150, unique: true, nullable: false })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  phoneNumber: string;

  @Column({ default: false })
  verified: boolean;

  @BeforeInsert()
  encryptCredentials() {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = crypto.pbkdf2Sync(this.password, this.salt, 10000, 64, 'sha1').toString('base64');
  }
}
