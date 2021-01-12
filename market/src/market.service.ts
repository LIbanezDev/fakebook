import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(Product) private readonly productsRepo: Repository<Product>,
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
  ) {
  }

  getAll(): Promise<Product[]> {
    return this.productsRepo.find();
  }



}
