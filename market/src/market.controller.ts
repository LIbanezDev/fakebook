import { Controller } from '@nestjs/common';
import { MarketService } from './market.service';
import { MessagePattern } from '@nestjs/microservices';
import { Product } from './entity/product.entity';
import { DeleteProductDto } from './dto/product.dto';

@Controller('products')
export class MarketController {
  constructor(private readonly marketService: MarketService) {
  }

  @MessagePattern({ role: 'market', cmd: 'createProduct' })
  createProduct(data: Partial<Product>) {
    return this.marketService.createOne(data);
  }

  @MessagePattern({ role: 'market', cmd: 'products' })
  products() {
    return this.marketService.getAll();
  }

  @MessagePattern({ role: 'market', cmd: 'productById' })
  productById(productId: number) {
    return this.marketService.getOne(productId);
  }

  @MessagePattern({ role: 'market', cmd: 'productByUserId' })
  productByUserId(userId: number) {
    return this.marketService.getByUser(userId);
  }

  @MessagePattern({ role: 'market', cmd: 'updateProduct' })
  updateProduct(data: Partial<Product>) {
    return this.marketService.updateOne(data);
  }

  @MessagePattern({ role: 'market', cmd: 'deleteProduct' })
  deleteProduct(data: DeleteProductDto) {
    return this.marketService.deleteOne(data);
  }
}
