import { Route, Post, Body, Tags } from "tsoa";
import { justify, IJustifyPayload } from "../repositories/justify";
import {
  createRequest,
  getTodayTotalRequestSizeByToken,
} from "../repositories/apiRequest";
import { verifyToken } from "../repositories/token";
import { justifyConfig } from "../config";

@Route("justify")
@Tags("Justify")
export class JustifyController {
  @Post("/")
  public async justifyText(
    @Body() { token, text }: IJustifyPayload
  ): Promise<string> {
    const tokenEntry = await verifyToken(token);
    const todayBalance = await getTodayTotalRequestSizeByToken(tokenEntry);
    if (todayBalance + text.length > tokenEntry.rate_limit)
      throw new Error("Payment request");
    const textJustified = justify(text, justifyConfig.maxWidth);
    await createRequest({ token: tokenEntry, size: text.length });
    return textJustified;
  }
}
