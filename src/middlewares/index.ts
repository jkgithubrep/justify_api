import { Request, Response, NextFunction } from "express";

export const getTokenInRequestHeader = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    res.status(403);
    res.send("Token missing");
    return;
  }
  req.token = bearerHeader.split(" ")[1];
  next();
};
