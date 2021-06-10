import express, { Request, Response } from "express";
import { UserController } from "../controllers/user.controller";
import { ValidationError } from "../errors";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const controller = new UserController();
  try {
    await controller.createUser(req.body);
    res.send("User successfully created.");
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
