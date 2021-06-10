import { Route, Post, Body, Tags } from "tsoa";
import { User } from "../models";
import { createUser, IUserPayLoad } from "../repositories/user";

@Route("users")
@Tags("User")
export class UserController {
  @Post("/")
  public async createUser(@Body() body: IUserPayLoad): Promise<User> {
    return createUser(body);
  }
}
