import {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyRequest,
  RawServerDefault,
} from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { IncomingMessage, ServerResponse } from 'node:http';

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

  return {
    prisma,
    fastify,
  };
};
export default setContext;
