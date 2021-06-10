import bcrypt from "bcryptjs";
const saltRounds = 10;
import { getRepository } from "typeorm";

import { User } from "../models";

export interface IUserPayLoad {
  email: string;
  password: string;
}

export const createUser = async ({
  email,
  password,
}: IUserPayLoad): Promise<User> => {
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
