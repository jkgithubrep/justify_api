import jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { ValidationError } from "../errors";
import { User, Token } from "../models";
import { getUserByEmail } from "./user";

export interface ITokenPayload {
  user: User;
  rateLimit: number;
}

export const createToken = async ({
  user,
  rateLimit,
}: ITokenPayload): Promise<Token> => {
  const tokenRepository = getRepository(Token);
  const token = new Token();
  const data = {
    user: user,
    rate_limit: rateLimit,
  };
  return tokenRepository.save({
    ...token,
    ...data,
  });
};

export const getTokenByUser = async (user: User): Promise<Token | null> => {
  const token = await getRepository(Token).findOne({ where: { user } });
  if (!token) return null;
  return token;
};

export const verifyToken = async (tokenToVerify: string): Promise<Token> => {
  const decoded = jwt.verify(tokenToVerify, "shhhhhhhh", { complete: true });
  // @ts-ignore
  const user = await getUserByEmail(decoded.payload.email);
  if (!user) throw new ValidationError("User not found.");
  const token = await getTokenByUser(user);
  if (!token) throw new ValidationError("Token not found.");
  return token;
};
