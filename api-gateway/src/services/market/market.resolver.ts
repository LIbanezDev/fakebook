import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Product } from './market.entity';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../auth/auth.entity';
import { CreateProductArgs, DeleteProductArgs, UpdateProductArgs } from './market.dto';
import { CurrentUserGQL } from '../auth/auth.decorators';
import { JwtPayload } from '../auth/jwt';
import { getResponse, MutationResponse } from '../../utils/default';
import { internet, lorem, name } from 'faker';
import { AuthGuard } from '../auth/auth.guard';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';

@Resolver(of => Product)
export class MarketResolver {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
    @Inject('MARKET_CLIENT') private readonly marketClient: ClientProxy) {
  }

  @Query(() => Boolean)
  async seed() {
    const usersPromises = [];
    const productsPromises = [];
    for (let i = 0; i < 10; i++) {
      const firstName = name.firstName();
      const lastName = name.lastName();
      usersPromises.push(this.authClient
        .send<{ user: User; accessToken: string } | null>({ role: 'auth', cmd: 'register' }, {
          name: firstName + ' ' + lastName,
          description: lorem.lines(5),
          bornDate: new Date(2001, 1, 18),
          email: internet.email(firstName, lastName, 'gmail'),
          password: '123456',
          phoneNumber: '56930307070',
        }).toPromise());
    }
    await Promise.all(usersPromises);
    for (let i = 0; i < 10; i++) {
      productsPromises.push(this.marketClient.send<MutationResponse>({ role: 'market', cmd: 'createProduct' }, {
        title: name.title(),
        description: lorem.lines(8),
        price: Math.random() * (459900 - 1000) + 1000,
        userId: Math.random() * (11 - 1) + 1,
      }).toPromise());
    }
    await Promise.all(productsPromises);
    return true;
  }

  @Query(() => [Product])
  async products() {
    const products = await this.marketClient.send<Product[]>({ role: 'market', cmd: 'products' }, '').toPromise();
    const userIds = Array.from(new Set(products.map(p => p.userId))); // Removing duplicated user Ids
    const users = await this.authClient.send<User[]>({ role: 'auth', cmd: 'usersById' }, userIds).toPromise();
    return products.map(product => ({
      ...product,
      user: users.find(user => user.id === product.userId),
    }));
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Product)
  async createProduct(@Args() data: CreateProductArgs, @CurrentUserGQL() user: JwtPayload) {
    return getResponse(await this.marketClient.send<MutationResponse>({ role: 'market', cmd: 'createProduct' }, {
      userId: user.id,
      ...data,
    }).toPromise());
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Product)
  async updateProduct(@Args() data: UpdateProductArgs, @CurrentUserGQL() user: JwtPayload) {
    return getResponse(await this.marketClient.send<MutationResponse>({ role: 'market', cmd: 'updateProduct' }, {
      ...data,
      userId: user.id,
    }).toPromise());
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Product)
  async deleteProduct(@Args() data: DeleteProductArgs, @CurrentUserGQL() user: JwtPayload) {
    return getResponse(await this.marketClient.send<MutationResponse>({ role: 'market', cmd: 'deleteProduct' }, {
        id: data.id,
        userId: user.id,
      },
    ).toPromise());
  }

  @Mutation(() => Boolean)
  uploadFile(@Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload) {
    return new Promise(async (resolve, reject) =>
      file.createReadStream()
        .pipe(createWriteStream(`./uploads/${file.filename}`))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );
  }
}