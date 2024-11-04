import {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyRequest,
  RawServerDefault,
} from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { IncomingMessage, ServerResponse } from 'node:http';
import setLoaders from './setLoaders.js';

const setContext = (
  _req: FastifyRequest,
  fastify: FastifyInstance<
    RawServerDefault,
    IncomingMessage,
    ServerResponse<IncomingMessage>,
    FastifyBaseLogger,
    TypeBoxTypeProvider
  >,
) => {
  const { prisma } = fastify;
  const loaders = setLoaders(prisma);

  return {
    prisma,
    loaders,
    fastify,
  };
};
export default setContext;
