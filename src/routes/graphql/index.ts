import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate, specifiedRules } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { GQL_SCHEMA } from './schemas.js';
import handleGraphQLError from './helpers/handleGraphQLError.js';
import setContext from './helpers/setContext.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      try {
        const { query, variables } = req.body;

        const document = parse(query);
        const validationErrors = validate(GQL_SCHEMA, document, [
          ...specifiedRules,
          depthLimit(5),
        ]);

        if (validationErrors.length > 0) {
          return { errors: validationErrors };
        }

        return await graphql({
          schema: GQL_SCHEMA,
          source: query,
          variableValues: variables,
          contextValue: setContext(req, fastify),
        });
      } catch (e: unknown) {
        return { errors: [handleGraphQLError(e)] };
      }
    },
  });
};

export default plugin;
