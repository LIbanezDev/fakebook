import { Stream } from 'stream';

interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

export class AddImageDto {
  fileName: string;
  type: string;
}