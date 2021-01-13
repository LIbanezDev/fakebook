import { ArgsType, Field, Int } from '@nestjs/graphql';


@ArgsType()
export class CreateProductArgs {
  @Field()
  title: string;

  @Field(() => Int)
  price: number;

  @Field()
  description: string;
}

@ArgsType()
export class DeleteProductArgs {
  @Field(() => Int)
  id: number;
}

@ArgsType()
export class UpdateProductArgs extends DeleteProductArgs {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  description?: string;
}

