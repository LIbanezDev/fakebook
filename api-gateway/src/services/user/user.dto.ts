import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class AddImageToUserArgs {
  @Field(() => GraphQLUpload)
  image: FileUpload;

  @Field(() => Int)
  userId: number;
}