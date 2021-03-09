import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";

export type ReqWithUserId = Request<{}, any, any, {}> & { userId: number };
// 判断有没有权限
export const isAuth: RequestHandler<{}, any, any, {}> = async (
  req,
  _res,
  next
) => {
  // Bearer xxxx
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error("no authenticate");
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("no authenticate");
  }

  // 解密token
  try {
    const payload: any = await jwt.verify(token, process.env.JWT_KEY);
    console.log("payload: ", payload);
    (req as ReqWithUserId).userId = payload.userId;
    next();
    return;
  } catch {}

  throw new Error("no authenticate");
};
