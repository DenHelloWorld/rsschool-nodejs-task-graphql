import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { gqlResponseSchema, QL_SCHEMA } from './schemas.js';
import { graphql } from 'graphql';

interface GraphQLRequestBody {
  query: string;
  variables?: Record<string, unknown>;
}

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req, reply) {
      const body = req.body as GraphQLRequestBody;

      if (!body.query) {
        return reply.status(400).send({
          data: null,
          errors: [{ message: "The 'query' field is required." }],
        });
      }

      const result = await graphql({
        schema: QL_SCHEMA,
        source: body.query,
        variableValues: body.variables,
        contextValue: { prisma },
      });

      return reply.send(result);
    },
  });
};

export default plugin;
