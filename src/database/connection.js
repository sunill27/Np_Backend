const mongoose = require("mongoose");
const connectionString = process.env.DB_Url;

async function dbConnection() {
  await mongoose.connect(connectionString);
  console.log("Database Connected!");
}
module.exports = dbConnection;
