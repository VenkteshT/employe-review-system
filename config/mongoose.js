const mongoose = require("mongoose");

const url = process.env.DATABASE;

const DB = mongoose
  .connect(url, { useUnifiedTopology: true })
  .then(() => {
    console.log("database connection success");
  })
  .catch((err) => {
    console.log("error in connecting database:", err.message);
  });

module.exports = DB;
