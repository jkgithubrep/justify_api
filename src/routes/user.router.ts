import express, { Request, Response } from "express";
import { UserController } from "../controllers/user.controller";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const controller = new UserController();
  try {
    await controller.createUser(req.body);
    return res.send({
      message: "User successfully created.",
    });
  } catch (err) {
    return res.send({
      message: "Error when trying to create user.",
    });
  }
});

export default router;
