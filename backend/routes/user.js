import express from "express";
import z from "zod";
import { User, Account } from "../db.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../backend.config.js";
import { authMiddleware } from "../middleware.js";

export const userRouter = express.Router();

function validateUser(user) {
  const User = z.object({
    firstName: z.string(),
    lastName: z.string(),
    password: z.string(),
    username: z.string().email(),
  });

  const validatedUser = User.safeParse(user);

  return validatedUser;
}

//SignUp Route
userRouter.post("/signup", async (req, res) => {
  const user = req.body;

  const { success } = validateUser(user);

  const existingUser = await User.findOne({ username: user.username }).exec();

  //If user validation fails
  if (!success) {
    return res.status(411).json({ message: "Incorrect inputs" });
  }

  //If the user exist with the same credentials
  if (existingUser) {
    return res.status(411).json({ message: "Email already taken" });
  }

  const newUser = new User({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  //Creating the hashed password from the received the password
  const hashedPassword = await newUser.createHash(user.password);

  //Adding the hashed password in the user to the database
  newUser.password_hash = hashedPassword;

  //Saving  the user to the database
  const addedUser = await newUser.save();

  //Getting the Unique User Id of newly created user
  const userId = addedUser._id;

  //generating the JWT token for the user from the Newly Created UserId
  const userToken = jwt.sign({ userId }, JWT_SECRET);

  const initialAccountBalance = 1 + Math.random() * 1000;

  //Creating new Account for the new user
  await Account.create({
    userId,
    balance: initialAccountBalance * 100,
  });

  if (userToken && newUser) {
    return res.json({
      message: "User Created Successfully!",
      token: userToken,
      user: newUser,
    });
  }
});

const signinBody = z.object({
  username: z.string().email(),
  password: z.string(),
});

//SignIn Route
userRouter.post("/signIn", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Invalid Username or Password!",
    });
  }
  const user = await User.findOne(
    {
      username: req.body.username,
    },
    "firstName lastname password_hash"
  );

  if (!user) {
    return res.status(411).json({
      message: "User Not Found!",
    });
  } else {
    if (await user.validatePassword(req.body.password)) {
      const userId = user._id;
      //generating the access token for the signIn
      const accessToken = jwt.sign({ userId }, JWT_SECRET);
      console.log("User logged in Successfully!");

      return res.status(200).json({ token: accessToken, user: user });
    } else {
      return res.status(411).json({
        message: "Incorrect password!",
      });
    }
  }
});

const updatedDataSchema = z.object({
  password: z.string().min(8, { message: "Password is too small." }),
  firstName: z.string(),
  lastName: z.string(),
});

//Update the user Details
userRouter.put("/update", authMiddleware, async (req, res) => {
  const { success, error, data } = updatedDataSchema.safeParse(req.body);

  if (error) {
    return res.status(411).json(error);
  }

  if (!success) {
    return res.status(411).json({
      message: "Invalid credentials!",
    });
  }
  const user = await User.findOne({ _id: req.userId });
  const updated_password_hash = await user.createHash(req.body.password);

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.userId },
    {
      password_hash: updated_password_hash,
      firstName: data.firstName,
      lastName: data.lastName,
    }
  );

  if (updatedUser) {
    return res.status(200).json({
      message: "User Updated Successfully!",
    });
  } else {
    return res.status(400).json({
      message: "Unable to updated the user Details!",
    });
  }
});

//Filter the Users by their name
userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find(
    {
      $or: [
        { firstName: { $regex: filter, $options: "i" } },
        { lastName: { $regex: filter, $options: "i" } },
      ],
    },
    "firstName lastName"
  ).exec();

  return res.status(200).json({ users: users });
});
