import express, { Request, Response } from "express";
import { JustifyController } from "../controllers/justify.controller";

const router = express.Router();

router.post("/:token", async (req: Request, res: Response) => {
  const controller = new JustifyController();
  try {
    const { token } = req.params;
    const textJustified = await controller.justifyText({
      token,
      text: req.body,
    });
    return res.send(textJustified);
  } catch (err) {
    console.log(err);
    return res.send({
      message: err.message,
    });
  }
});

export default router;
