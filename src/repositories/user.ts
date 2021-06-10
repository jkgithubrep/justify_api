import bcrypt from "bcryptjs";
const saltRounds = 10;
import { getRepository } from "typeorm";
import validator from "validator";
import { ValidationError } from "../errors";

import { User } from "../models";

export interface IUserPayload {
  email: string;
  password: string;
}

const validateEmail = async (email: string): Promise<void> => {
  if (!validator.isEmail(email))
    throw new ValidationError("Invalid email address.");
  const userFound = await getUserByEmail(email);
  if (userFound) throw new ValidationError("Email address already used.");
};

const validatePassword = (password: string): void => {
  if (password.length < 8)
    throw new ValidationError("Password must have at least 12 characters.");
  if (password.length > 50)
    throw new ValidationError("Password should not exceed 50 characters.");
};

export const createUser = async ({
  email,
  password,
}: IUserPayload): Promise<User> => {
  await validateEmail(email);
  validatePassword(password);
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
  if (!user) throw new ValidationError("Invalid email or password.");
  const match = await bcrypt.compare(password, user.passhash);
  if (!match) throw new ValidationError("Invalid email or password");
  // Line to add to prevent someone from creating multiple account to easily.
  // if (!user.validated) throw new Error("Email address not validated.");
  return user;
};
