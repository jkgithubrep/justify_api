import express, { Request, Response } from "express";
import { TokenController } from "../controllers/token.controller";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const controller = new TokenController();
  try {
    const token = await controller.createToken(req.body);
    return res.send({
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      message: err.message,
    });
  }
});

export default router;
