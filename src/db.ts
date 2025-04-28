import { Pool, PoolConfig } from 'pg';

export const query = (text: string, params?: any[]) => {
  const config: PoolConfig = {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: String(process.env.POSTGRES_PASSWORD),
    database: process.env.POSTGRES_DBNAME,
  };
  
  if (process.env.POSTGRES_REJECT_UNAUTHORIZED === 'true') {
    config.ssl = {
      rejectUnauthorized: true,
    };
  } else if (process.env.POSTGRES_REJECT_UNAUTHORIZED === 'false') {
    config.ssl = {
      rejectUnauthorized: false,
    };
  }
  
  const pool = new Pool(config);

  return pool.query(text, params);
};
