import { Server } from '@hapi/hapi';
import { routes } from '../routes/index.route';

export const hapiLoader = async (server: Server) => {
  await routes(server);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};
