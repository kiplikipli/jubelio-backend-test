import { Pool, PoolClient, PoolConfig, QueryArrayConfig } from 'pg';

let existingPool: Pool | PoolClient;

export const pgPool = async () => {
  if (existingPool) {
    return existingPool;
  }

  const poolConfig: PoolConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
  };

  existingPool = await new Pool(poolConfig).connect();
  return existingPool;
};

export const pgQuery = async (text: string, params?: any) => {
  const start = Date.now();
  const pool = await pgPool();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};
