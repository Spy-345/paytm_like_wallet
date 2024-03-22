import mongoose from "mongoose";
import bcrypt from "bcrypt";

const uri =
  "mongodb+srv://spy-admin:spy-admin@cluster0.hltplup.mongodb.net/paytm-db?retryWrites=true&w=majority&authMechanism=DEFAULT";

try {
  await mongoose.connect(uri);
  mongoose.connection.on("error", (err) => {
    logError(err);
  });
} catch (err) {
  console.log(err);
}

//Defining the UserSchemars
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password_hash: { type: String, required: true },
  username: { type: String, required: true },
});

//Defining the Account Schema
const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

//Schema Method to generate the password hash
UserSchema.methods.createHash = async function (plainTextPassword) {
  const saltRounds = 10;

  //Generating Salt
  const salt = await bcrypt.genSalt(saltRounds);

  //Creating the hash from the passwod
  return await bcrypt.hash(plainTextPassword, salt);
};

//Schema Method to validate the user Password
UserSchema.methods.validatePassword = async function (plainTextPassword) {
  return await bcrypt.compare(plainTextPassword, this.password_hash);
};

//Creating the User Model/Table
export const User = new mongoose.model("user", UserSchema);

//Creating the Account Model/Table
export const Account = new mongoose.model("account", AccountSchema);
