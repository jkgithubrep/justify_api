import express from "express";
import UserRouter from "./user.router";
import TokenRouter from "./token.router";
import JustifyRouter from "./justify.router";

const router = express.Router();

const root = "/api";

router.use(`${root}/users`, UserRouter);
router.use(`${root}/token`, TokenRouter);
router.use(`${root}/justify`, JustifyRouter);

export default router;
