import { Route, Post, Body, Tags } from "tsoa";
import { User } from "../models";
import { createUser, IUserPayload } from "../repositories/user";

@Route("api/users")
@Tags("User")
export class UserController {
  @Post("/")
  public async createUser(@Body() body: IUserPayload): Promise<User> {
    return createUser(body);
  }
}
