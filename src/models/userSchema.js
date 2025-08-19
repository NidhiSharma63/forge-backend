import pkg from "jsonwebtoken";
import mongoose from "mongoose";
const jwt = pkg;
const { JsonWebTokenError } = pkg;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  tokens: [
    {
      token: { type: String, required: true },
      uniqueBrowserId: { type: String, required: true },
    },
  ],
});

userSchema.methods.generateAuthToken = function (uniqueBrowserId) {
  try {
    const secretKey = process.env.SECRET_KEY || "defaultSecret";
    const genToken = jwt.sign({ id: this._id.toString() }, secretKey);
    this.tokens.push({ token: genToken, uniqueBrowserId });
    return genToken;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new Error(`JWT signing error: ${error.message}`);
    }
    throw error;
  }
};

const User = mongoose.model("User", userSchema);

export default User;
