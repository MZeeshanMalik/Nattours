const mongoose = require("mongoose");

const dotenv = require("dotenv");
const app = require("./app");
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log("connection established");
  });
console.log(process.env.NODE_ENV);

const port = 3000;
app.listen(port, () => {
  console.log("server has started....");
});

process.on("unhandledRejectoion", (err) => {
  console.log(err.message, err.name);
  process.exit(1);
});
