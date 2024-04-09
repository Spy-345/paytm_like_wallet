import express from "express";
import { authMiddleware } from "../middleware.js";
import { Account } from "../db.js";
import mongoose from "mongoose";

export const accountRouter = express.Router();

//To get the Account balance of the user
accountRouter.get("/balance", authMiddleware, async (req, res) => {
  //accessing the userId from the request object which set at time of the authorization
  const userId = req.userId;

  //getting the user account from the account collection
  const account = await Account.findOne({ userId: userId }, "balance").exec();
  const balance = account.balance / 100;
  return res.status(200).json({
    balance: balance,
  });
});

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
  //Accessing the user Id from the req object
  const userId = req.userId;

  //Creating the session of the mongodb client
  const session = await mongoose.startSession();

  //Starting the transaction
  session.startTransaction();

  //Transfer Details
  const { to, amount } = req.body;

  //User Accounts
  const senderAccount = await Account.findOne({ userId: userId }).session(
    session
  );
  const receiverAccount = await Account.findOne({
    userId: to,
  }).session(session);

  //If Provided Account is not Present
  if (!receiverAccount) {
    //Aborting the transaction
    await session.abortTransaction();
    return res
      .status(400)
      .json({ message: "Invalid Account!", success: false });
  }

  //If sender acount not found or sender has Low Account Balance
  if (!senderAccount || senderAccount.balance / 100 < amount) {
    //Aborting the transaction
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient Account Balance!",
      success: false,
    });
  }

  //Updating the Receivers balance and saving it with the session
  await Account.updateOne(
    { userId: to },
    {
      $inc: {
        balance: amount * 100,
      },
    }
  ).session(session);

  //Updating the From User Remaining amount
  await Account.updateOne(
    { userId: userId },
    { $inc: { balance: -amount * 100 } }
  ).session(session);

  //Committing the transaction
  await session.commitTransaction();
  return res
    .status(200)
    .json({ message: "Transfer Successful!", success: true });
});
