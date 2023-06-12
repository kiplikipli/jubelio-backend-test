import Hapi from '@hapi/hapi';
import { Server } from '@hapi/hapi';
import { loaders } from './loaders';
import dotenv from 'dotenv';

dotenv.config();

const startServer = async () => {
  const server = new Server({
    port: process.env.PORT || 3000,
  });

  try {
    await loaders(server);
  } catch (error) {
    console.error(error);
  }
};

startServer();
