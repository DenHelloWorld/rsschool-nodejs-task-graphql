import { PrismaClient } from '@prisma/client';
import Loaders from './loaders.js';

interface Context {
  prisma: PrismaClient;
  loaders: Loaders;
}

export default Context;
