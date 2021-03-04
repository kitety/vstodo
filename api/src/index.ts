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
  console.log("data: ", data);

  const app = express();

  passport.serializeUser((user: any, done) => {
    done(null, user.accessToken);
  });
  app.use(passport.initialize());
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3002/auth/github/callback",
      },
      async (_, __, profile, cb) => {
        console.log("profile: ", profile);
        const { id, displayName } = profile;
        let user = await User.findOne({ githubId: id });
        if (user) {
          user.name = displayName;
          await user.save;
        } else {
          user = await User.create({ name: displayName, githubId: id }).save();
        }
        console.log("user: ", user);
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
  app.get("/", (req, res) => {
    res.send("hello");
  });

  app.listen(3002, () => {
    console.log("The server is listening on port 3002!!");
  });
};
main();
