import express, { Request, Response } from "express";
import { TokenController } from "../controllers/token.controller";
import { ValidationError } from "../errors";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const controller = new TokenController();
  try {
    const token = await controller.createToken(req.body);
    return res.send({
      token: token,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400);
      res.send(err.message);
    } else {
      res.status(500);
      res.send("Please try again later.");
    }
  }
});

export default router;
