import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { join } from "path";
import { User } from "./entities/User";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    logging: !__prod__,
    synchronize: !__prod__, // 自动创建数据库
    database: "vstodo",
    username: "postgres",
    password: "1366",
    entities: [join(__dirname, "./entities/*.*")],
  });
  const data = await User.find({ name: "kitety" });
  console.log("data: ", data);
  // const user = await User.create({ name: "kitety" }).save();
  // console.log("user: ", user);
  const app = express();
  app.get("/", (_req, res) => {
    res.send("hello");
  });
  app.listen(3002, () => {
    console.log("The server is listening on port 3002!!");
  });
};
main();
