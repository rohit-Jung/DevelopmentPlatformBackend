const mongoose = require("mongoose");
const { DB_NAME } = require("../constants");

const connectDatabase = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("Couldn't connect to MongoDB", error);
    process.exit(1);
  }
};

module.exports = connectDatabase;
