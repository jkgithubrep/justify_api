import express, { Request, Response } from "express";
import { JustifyController } from "../controllers/justify.controller";
import { PaymentError, ValidationError } from "../errors";
import { getTokenInRequestHeader } from "../middlewares";

const router = express.Router();

router.post(
  "/",
  getTokenInRequestHeader,
  async (req: Request, res: Response) => {
    const controller = new JustifyController();
    try {
      if (!req.is("text/plain"))
        throw new ValidationError("Expected MIME type: plain/text");
      const token = req.token;
      const textJustified = await controller.justifyText({
        token,
        text: req.body,
      });
      res.set("content-type", "text/plain");
      return res.send(textJustified);
    } catch (err) {
      if (err instanceof PaymentError) {
        res.status(402);
        res.send(err.message);
      } else if (err instanceof ValidationError) {
        res.status(400);
        res.send(err.message);
      } else {
        console.log(err);
        res.status(500);
        res.send("Please try again later");
      }
    }
  }
);

export default router;
