import "reflect-metadata";
require("dotenv-safe").config();
import express from "express";
import { createConnection } from "typeorm";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";
import { __prod__ } from "./constants";
import { join } from "path";
import { User } from "./entities/User";
import jwt from "jsonwebtoken";
import cors from "cors";

const main = async () => {
  await createConnection({
    type: "postgres",
    logging: !__prod__,
    synchronize: !__prod__, // 自动创建数据库
    database: "vstodo",
    username: "postgres",
    password: "1366",
    entities: [join(__dirname, "./entities/*.*")],
  });

  const data = await User.find({ name: "kitety" });

  const app = express();

  passport.serializeUser((user: any, done) => {
    done(null, user.accessToken);
  });
  app.use(cors({ origin: "*" })); //cors
  app.use(passport.initialize());
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

  app.get("/auth/github", passport.authenticate("github", { session: false }));

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    (req: any, res) => {
      res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    }
  );
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
