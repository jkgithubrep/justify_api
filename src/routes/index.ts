import express from "express";
import UserRouter from "./user.router";
import TokenRouter from "./token.router";
import JustifyRouter from "./justify.router";

const router = express.Router();

router.use("/users", UserRouter);
router.use("/token", TokenRouter);
router.use("/justify", JustifyRouter);

export default router;
