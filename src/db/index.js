import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`\n mongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    // (connectionInstance.connection.host) aksar ye isi ley akarwaya jata ha
        // ka agar ma galti se production ki jagah kisi or server par connect ho jao
        // Q K database jo ha na wo production ka alag hota ha testing ka alag hota ha development ka alag hota ha
        // to at least mujehy pata rahay ka kon sey host par ma connect ho raha hu
} catch (error) {
    console.log(`mongoDB connection Failed ${error}`);
    process.exit(1); // study exit codes
  }
};

export default connectDB;