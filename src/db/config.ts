import { ConnectionOptions } from "typeorm";
import { User, Token, ApiRequest } from "../models";

const getOptions = (): ConnectionOptions => {
  const connectionOptions: ConnectionOptions = {
    type: "postgres",
    entities: [User, Token, ApiRequest],
    synchronize: true,
  };
  if (process.env.DATABASE_URL) {
    Object.assign(connectionOptions, {
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  } else {
    Object.assign(connectionOptions, {
      host: process.env.POSTGRES_HOST || "localhost",
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD || "jk",
      database: process.env.POSTGRES_DB || "justify",
    });
  }
  return connectionOptions;
};

export const configDB = getOptions();
