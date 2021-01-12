import { Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { Product } from './market.entity';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../auth/auth.entity';


@Resolver(of => Product)
export class MarketResolver {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
    @Inject('MARKET_CLIENT') private readonly marketClient: ClientProxy) {
  }

  @ResolveField()
  createdAt(@Root() product: Product) {
    return new Date(product.createdAt).toLocaleDateString();
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
}