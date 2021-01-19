import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ICredential } from '../interfaces/entity.interface';
import * as crypto from 'crypto';
import { Role } from './role.entity';
import { AuthType } from './authType.entity';


@Entity({ name: 'users_creds' })
export class Credential implements ICredential {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  salt: string;

  @Column({ default: false })
  verified: boolean;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'credentials_roles', joinColumn: { name: 'userCredId' }, inverseJoinColumn: { name: 'roleId' } })
  roles: Role[];

  @ManyToOne(() => AuthType, aT => aT.credentials)
  authType: AuthType;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  encryptCredentials() {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = crypto.pbkdf2Sync(this.password, this.salt, 10000, 64, 'sha1').toString('base64');
  }
}
