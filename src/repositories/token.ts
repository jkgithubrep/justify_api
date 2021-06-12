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

type DecodedToken = {
  signature: string;
  header: string;
  payload: { email: string; password: string };
};

export const verifyToken = async (tokenToVerify: string): Promise<Token> => {
  let decoded: DecodedToken;
  try {
    // @ts-ignore
    decoded = jwt.verify(tokenToVerify, process.env.JWT_SECRET || "test", {
      complete: true,
    });
  } catch (err) {
    throw new ValidationError("Invalid token.");
  }
  const user = await getUserByEmail(decoded.payload.email);
  if (!user) throw new ValidationError("User not found.");
  const token = await getTokenByUser(user);
  if (!token) throw new ValidationError("Token not found.");
  return token;
};
