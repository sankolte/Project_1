const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { init } = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/come_and_live";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});    //ekkbar sara data clean karke fir hum naya add karenge
  //listem now for auth we have to add owner to each and every document to wo manuallay impossible so we will use map function bascially each document ke liye usme owner add karenege
  // console.log(initData.data);
  
  initData.data=initData.data.map((obj)=>({
    ...obj,owner:['6995927685f9485d1eda075a']
  }));
  //basically ...obj kya he idahr ::
  //so basically here 
// a new created array will only contain owner field 
// coz ...obj copies that data in previous data in that array in our newly created array

  
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();



//Map function revision:
// .map():

// Loops through an array

// Transforms each item

// Returns a new array

// It does NOT modify the original array
//const numbers = [1, 2, 3];

// const doubled = numbers.map((num) => {
//   return num * 2;
// });

// console.log(doubled);