import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Product } from './market.entity';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../auth/auth.entity';
import { CreateProductArgs, DeleteProductArgs, UpdateProductArgs } from './market.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUserGQL } from '../auth/auth.decorators';
import { JwtPayload } from '../auth/jwt';
import { getResponse, MutationResponse } from '../utils/default';


@UseGuards(AuthGuard)
@Resolver(of => Product)
export class MarketResolver {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
    @Inject('MARKET_CLIENT') private readonly marketClient: ClientProxy) {
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

  @Mutation(() => Product)
  async createProduct(@Args() data: CreateProductArgs, @CurrentUserGQL() user: JwtPayload) {
    return getResponse(await this.marketClient.send<MutationResponse>({ role: 'market', cmd: 'createProduct' }, {
      userId: user.id,
      ...data,
    }).toPromise());
  }

  @Mutation(() => Product)
  async updateProduct(@Args() data: UpdateProductArgs, @CurrentUserGQL() user: JwtPayload) {
    return getResponse(await this.marketClient.send<MutationResponse>({ role: 'market', cmd: 'updateProduct' }, {
      ...data,
      userId: user.id,
    }).toPromise());
  }

  @Mutation(() => Product)
  async deleteProduct(@Args() data: DeleteProductArgs, @CurrentUserGQL() user: JwtPayload) {
    return getResponse(await this.marketClient.send<MutationResponse>({ role: 'market', cmd: 'deleteProduct' }, {
        id: data.id,
        userId: user.id,
      },
    ).toPromise());
  }
}