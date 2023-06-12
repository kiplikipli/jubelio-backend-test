import { Server } from '@hapi/hapi';
import { hapiLoader } from './hapi.loader';

export const loaders = async (server: Server) => {
  await hapiLoader(server);
};
