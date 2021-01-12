import { Controller, Get } from '@nestjs/common';
import { MarketService } from './market.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('products')
export class MarketController {
  constructor(private readonly marketService: MarketService) {
  }

  @MessagePattern({ role: 'market', cmd: 'products' })
  allProducts() {
    return this.marketService.getAll();
  }
}
