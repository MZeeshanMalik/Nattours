const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const Tour = require("../../Models/toursmodel");
const Reviews = require("../../Models/rewiew");
const Users = require("../../Models/userModel");
// dotenv.config({ path: '../../../config.env' });
// const DB = process.env.DATABASE_LOCAL;
// console.log(DB);

mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log("connection established");
  });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const user = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const review = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

//import data into database

const importData = async () => {
  try {
    // await Tour.create(tours, { validateBeforSave: false });
    await Users.create(user, { validateBeforSave: false });
    // await Reviews.create(review, { validateBeforSave: false });
    console.log("sucessfully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// delete all data form Db

const deleteDAta = async () => {
  try {
    // await Tour.deleteMany();--
    // await Reviews.deleteMany();
    await Users.deleteMany();
    console.log("sucessfully deleted");
  } catch (err) {
    console.log(err);
    process.exit();
  }
};
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteDAta();
}

console.log(process.argv);
