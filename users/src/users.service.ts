import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { FindConditions, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { AddImageDto } from './dto/addImageDto';
import { Image, ImagesTypes } from './entity/image.entity';
import { FindOptions } from '@nestjs/schematics';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(ImagesTypes) private readonly imagesTypeRepo: Repository<ImagesTypes>,
    @InjectRepository(Image) private readonly imageRepo: Repository<Image>) {
    this.imagesTypeRepo.findOne({ where: { name: 'profile' } })
      .then(data => {
        if (!data) this.imagesTypeRepo.save([
          { name: 'profile' },
          { name: 'front' },
          { name: 'normal' },
        ]);
      });
  }

  async deleteOne(id: number) {
    const user = await this.userRepo.findOne(id);
    await this.userRepo.remove(user);
    return true;
  }

  async getOne(conditions: FindOneOptions<User>): Promise<User | null> {
    return (await this.userRepo.findOne(conditions)) || null;
  }

  getMany(conditions: FindManyOptions<User>): Promise<User[]> {
    return this.userRepo.find(conditions);
  }

  async addImage(data: AddImageDto) {
    const newImage = new Image();
    newImage.type = await this.imagesTypeRepo.findOne({ where: { name: data.type } });
    newImage.path = data.fileName;
    await this.imageRepo.save(newImage);
  }

  async registerUser(data) {
    return await this.userRepo.save(this.userRepo.create(data));
  }
}
