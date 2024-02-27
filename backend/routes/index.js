import express from "express";
import { userRouter } from "./user.js";

export const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  res.send("Root router working");
});

//Routing the user request to userRouter
rootRouter.use("/user", userRouter);
