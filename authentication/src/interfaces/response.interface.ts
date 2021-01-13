export class ResponseInterface<T> {
  ok: boolean;
  msg?: string;
  data?: T;
}
