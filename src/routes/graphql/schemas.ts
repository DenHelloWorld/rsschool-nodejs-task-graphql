import { Type } from '@fastify/type-provider-typebox';
import { GraphQLSchema } from 'graphql';
import MutationType from './types/mutationType.js';
import { QueryType } from './types/queryType.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const GQL_SCHEMA = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
