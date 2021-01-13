import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../auth/auth.entity';


@ObjectType()
export class Product {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  price: number;

  @Field()
  title: string;

  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => Int)
  userId: number;

  @Field()
  description: string;

  @Field(() => String)
  updatedAt: Date;

  @Field(() => String)
  createdAt: Date;
}