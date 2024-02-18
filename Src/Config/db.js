const mongoose = require("mongoose");
const MiscServices = require("../Services/MiscServices");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const dbConnection = mongoose.connection;
    dbConnection.on('error', console.error.bind(console, 'Connection error:'));
    dbConnection.once('open', () => {
      console.log(dbConnection, "MongoDB Connected");
    });
    return dbConnection;
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
};

const connectMultiDB = async (req, res, next) => {
  try {
    if (mongoose.connection) {
      const dbConnection = await mongoose.connection;
      dbConnection.on('error', console.error.bind(console, 'Connection error:'));
      dbConnection.once('open', () => {
        console.log('Connected to Default Database');
      });
      const newDatabaseName = req.body.dbName;  // value must be decoded and here need to encode
      req.user.myDataBase = dbConnection.useDb(newDatabaseName);;
      console.log(` MongoDB Connected`);
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).json(MiscServices.response(401, process.env.UN_AUTHORIZED, {}));
    process.exit(0);
  }
}

const closeConnection = async () => {
  try {
    mongoose.connection.close(function () {
      console.log('Mongoose connection closed');
    });
  } catch (error) {
    process.exit(0);
  }
}

module.exports = {
  connectDB, connectMultiDB, closeConnection
};
