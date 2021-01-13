import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { DeleteProductDto, MutationResponse } from './dto/product.dto';

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

  async getOne(id: number): Promise<Product | null> {
    return (await this.productsRepo.findOne(id)) || null;
  }

  getByUser(userId: number): Promise<Product[]> {
    return this.productsRepo.find({
      where: {
        userId,
      },
    });
  }

  async createOne(data: Partial<Product | null>): Promise<MutationResponse<Product>> {
    try {
      const newProduct = await this.productsRepo.save(this.productsRepo.create(data));
      return { ok: true, msg: 'Producto creado', code: HttpStatus.CREATED, data: newProduct };
    } catch (e) {
      return { ok: true, msg: 'No se pudo crear el producto ' + JSON.stringify(e), code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }

  async updateOne(product: Partial<Product>): Promise<MutationResponse<Product>> {
    try {
      const p = await this.productsRepo.findOne({
        id: product.id,
        userId: product.userId,
      });
      if (!p) return { ok: false, msg: 'Producto no encontrado', code: 404 };
      await this.productsRepo.update({
        id: product.id,
        userId: product.userId,
      }, product);
      return { ok: true, msg: 'Producto actualizado', code: HttpStatus.OK, data: { ...p, ...product } };
    } catch (e: unknown) {
      Logger.log(e);
      return { ok: false, msg: 'Error al actualizar' + JSON.stringify(e), code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }

  async deleteOne(data: DeleteProductDto): Promise<MutationResponse<Product>> {
    try {
      const product = await this.productsRepo.findOne({
        where: data,
      });
      if (!product) return { ok: false, msg: 'Producto no encontrado', code: HttpStatus.NOT_FOUND };
      await this.productsRepo.softDelete(data.id);
      return { ok: true, msg: 'Producto eliminado correctamente', code: HttpStatus.OK, data: product };
    } catch (e: unknown) {
      return { ok: false, msg: 'No se pudo eliminar el producto' + JSON.stringify(e), code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
