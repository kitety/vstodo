import "reflect-metadata";
require("dotenv-safe").config();
import express from "express";
import { createConnection } from "typeorm";
import passport from "passport";
var GitHubStrategy = require("passport-github").Strategy;
import { __prod__ } from "./constants";
import { join } from "path";
import { User } from "./entities/User";
import jwt from "jsonwebtoken";
import cors from "cors";
import { Todo } from "./entities/Todo";
import { isAuth } from "./isAuth";

const main = async () => {
  await createConnection({
    dropSchema: true,
    type: "postgres",
    logging: !__prod__,
    synchronize: !__prod__, // 自动创建数据库
    database: "vstodo",
    username: "postgres",
    password: "1366",
    entities: [join(__dirname, "./entities/*.*")],
  });

  // const data = await User.find({ name: "kitety" });
  // console.log("data: ", data);

  const app = express();

  passport.serializeUser((user: any, done) => {
    done(null, user.accessToken);
  });
  // middle ware
  app.use(cors({ origin: "*" })); //cors
  app.use(passport.initialize());
  app.use(express.json());

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3002/auth/github/callback",
      },
      async (_, __, profile, cb) => {
        const { id, displayName } = profile;
        let user = await User.findOne({ githubId: id });
        if (user) {
          user.name = displayName;
          await user.save;
        } else {
          user = await User.create({ name: displayName, githubId: id }).save();
        }

        var accessToken = jwt.sign({ userId: id }, process.env.JWT_KEY, {
          expiresIn: "1y",
        });
        cb(null, { accessToken });
      }
    )
  );
  try {
    app.get(
      "/auth/github",
      passport.authenticate("github", { session: false })
    );
  } catch (error) {
    console.log("error: ", 222);
  }
  try {
    app.get(
      "/auth/github/callback",
      passport.authenticate("github", { session: false }),
      (req: any, res) => {
        res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
      }
    );
  } catch (error) {
    console.log("error: ", 11111);
  }

  // Todos
  app.post("/todo", isAuth, async (req: any, res) => {
    console.log("req: ", req.body);
    console.log("req.userId: ", req.userId);
    // text
    const todo = await Todo.create({
      text: req.body.text,
      creatorId: req.userId,
    }).save();
    res.send({ todo });
  });

  app.get("/me", async (req, res) => {
    // Bearer xxxx
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.send({ user: null });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.send({ user: null });
    }

    // 解密token
    let userId = "";
    try {
      const payload: any = await jwt.verify(token, process.env.JWT_KEY);
      userId = payload.userId;
    } catch (error) {
      return res.send({ user: null });
    }
    if (!userId) {
      return res.send({ user: null });
    }
    const user = await User.findOne({ githubId: userId });

    return res.send({ user });
  });
  app.get("/", (_req, res) => {
    res.send("hello");
  });

  app.listen(3002, () => {});
};
main();
