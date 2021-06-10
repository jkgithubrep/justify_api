import { ConnectionOptions } from "typeorm";
import { User, Token } from "../models";

export const configDB: ConnectionOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "jk",
  database: process.env.POSTGRES_DB || "justify",
  entities: [User, Token],
  synchronize: true,
};
