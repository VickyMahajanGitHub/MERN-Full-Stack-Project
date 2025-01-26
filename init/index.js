const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

//connecting to database
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67769a23e79b94ed19a51f47",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
