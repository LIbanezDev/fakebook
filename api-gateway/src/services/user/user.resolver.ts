import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Bucket } from '@google-cloud/storage';

@Resolver(of => User)
export class UserResolver {
  constructor(
    @Inject('GCP_BUCKET') private readonly gcpBucket: Bucket,
    @Inject('USERS_CLIENT') private readonly usersClient: ClientProxy) {
  }

  @Mutation(() => Boolean)
  async uploadFile(@Args({ name: 'image', type: () => GraphQLUpload }) file: FileUpload) {
    const fileExtension = file.filename.split('.').pop();
    const fullName = new Date().getTime() + '.' + fileExtension;
    const folder = 'users/';
    return new Promise(res => {
      file.createReadStream().pipe(
        this.gcpBucket.file(folder + fullName).createWriteStream({
          resumable: false,
          gzip: true,
        }),
      )
        .on('finish', async () => {
          await this.usersClient.send({ role: 'user', cmd: 'addImageToUser' }, {
            fileName: fullName,
            type: 'normal',
          }).toPromise();
          res(true);
        })
        .on('error', (e) => {
          Logger.log(e);
          res(false);
        });
    });
  }
}
