import { Controller, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { AddImageDto } from './dto/addImageDto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @MessagePattern({ role: 'user', cmd: 'getById' })
  getUserById(id: number) {
    return this.usersService.getOne({ where: { id } });
  }

  @MessagePattern({ role: 'user', cmd: 'getByCredentialId' })
  getUserByCredentialId(credentialId: number) {
    return this.usersService.getOne({ where: { credentialId } });
  }

  @MessagePattern({ role: 'user', cmd: 'registerUser' })
  addUser(data) {
    return this.usersService.registerUser(data);
  }

  @MessagePattern({ role: 'user', cmd: 'removeUser' })
  removeUser(id: number) {
    return this.usersService.deleteOne(id);
  }

  @MessagePattern({ role: 'user', cmd: 'addImageToUser' })
  addImageToUser(data: AddImageDto) {
    Logger.log('XD');
    return this.usersService.addImage(data);
  }
}
