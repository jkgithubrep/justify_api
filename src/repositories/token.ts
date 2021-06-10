import { getRepository } from "typeorm";
import { User, Token } from "../models";

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
