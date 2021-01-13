export class MutationResponse<T> {
  ok: boolean;
  msg: string;
  code: number;
  data?: T;
}

export class DeleteProductDto {
  id: number;
  userId: number;
}