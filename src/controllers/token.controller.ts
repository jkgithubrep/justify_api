import { Route, Post, Body, Tags } from "tsoa";
import jwt from "jsonwebtoken";
import { validateUser, IUserPayload } from "../repositories/user";
import { createToken, getTokenByUser } from "../repositories/token";

@Route("token")
@Tags("Token")
export class TokenController {
  @Post("/")
  public async createToken(@Body() body: IUserPayload): Promise<string> {
    const user = await validateUser(body);
    const existingToken = await getTokenByUser(user);
    if (!existingToken) await createToken({ user, rateLimit: 800 });
    const token = jwt.sign(body, "shhhhhhhh");
    return token;
  }
}