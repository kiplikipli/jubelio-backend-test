import { Server, ServerRoute } from '@hapi/hapi';
import { GET_METHOD } from '../constants';
import { getProductRoutes } from './product.route';
import { getAdjustmentTransactionRoutes } from './adjustment-transaction.route';

export const routes = async (server: Server): Promise<void> => {
  const indexRoute = [
    {
      method: GET_METHOD,
      path: '',
      handler: () => {
        return {
          message: 'Jubelio Backend Test API',
        };
      },
    },
  ];

  const productRoutes = getProductRoutes();
  const adjustmentTransactionRoutes = getAdjustmentTransactionRoutes();

  const allRoutes = [
    ...indexRoute,
    ...productRoutes,
    ...adjustmentTransactionRoutes,
  ];
  const prefixedRoutes: ServerRoute[] = allRoutes.map((r) => {
    return {
      ...r,
      path: `/api${r.path}`,
    };
  });

  server.route(prefixedRoutes);
};
