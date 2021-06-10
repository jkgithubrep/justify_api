import bcrypt from "bcryptjs";
const saltRounds = 10;
import { getRepository } from "typeorm";

import { User } from "../models";

export interface IUserPayload {
  email: string;
  password: string;
}

export const createUser = async ({
  email,
  password,
}: IUserPayload): Promise<User> => {
  const userRepository = getRepository(User);
  const user = new User();
  const data = {
    email: email,
    passhash: await bcrypt.hash(password, saltRounds),
    validated: false,
  };
  return userRepository.save({
    ...user,
    ...data,
  });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ email: email });
  if (!user) return null;
  return user;
};

export const validateUser = async ({
  email,
  password,
}: IUserPayload): Promise<User> => {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("Invalid email or password.");
  const match = await bcrypt.compare(password, user.passhash);
  if (!match) throw new Error("Invalid email or password");
  // if (!user.validated) throw new Error("Email address not validated.");
  return user;
};
