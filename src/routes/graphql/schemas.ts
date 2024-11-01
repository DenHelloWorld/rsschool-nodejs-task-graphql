import { Type } from '@fastify/type-provider-typebox';
import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

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
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello, world!',
    },
  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    increment: {
      type: GraphQLInt,
      args: {
        value: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (_, args: { value: number }) => {

        if (typeof args.value !== 'number') {
          throw new Error("The 'value' argument must be a number.");
        }
        return args.value + 1;
      },
    },
  },
});

export const QL_SCHEMA = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
