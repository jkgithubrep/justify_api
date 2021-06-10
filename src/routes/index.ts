import express from "express";
import UserRouter from "./user.router";
import TokenRouter from "./token.router";

const router = express.Router();

router.use("/users", UserRouter);
router.use("/token", TokenRouter);

export default router;
