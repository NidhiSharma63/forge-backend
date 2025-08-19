import mongoose from "mongoose";

const connectDB = async (uri) => {
  console.log("URL**************", uri);
  return mongoose.connect(uri, {});
};
export default connectDB;
