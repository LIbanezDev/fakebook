import { HttpException } from '@nestjs/common';
import { Product } from '../market/market.entity';

export interface MutationResponse {
  ok: string;
  msg: string;
  code: number;
  data?: Product
}

export const getResponse = (res: MutationResponse) => {
  if (!res.ok) throw new HttpException(res.msg, res.code);
  return res.data;
};