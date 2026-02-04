const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");   //this is the pakage used for whatver we did with bolerplate and other ejs files like ekk kiya design and then sabko usse hu banaya
const expressError = require("./utils/expressError.js");

// const  listingSchema =require("./schema.js");
// const reviewSchema=require("./schema.js");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const listingsRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
app.use("/listings/:id/reviews", reviewRoute);
app.use("/listings", listingsRoute);


main()
    .then(() => {
        console.log("connection succesful !!");

    })
    .catch((err) => {
        console.log(err)
    })


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/come_and_live');

}

//this error handling middleware for perticularly managing page not found errror 
app.use((req, res, next) => {
    next(new expressError(404, "Page not found!"))

})

// error handling middlewares >>  used by express like anything happens in the app express sidah comes to this coz wrapasync ke karan sab ka catch me yahi he 
app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs", { message });

    // res.send("Something went wrong !!");

})
//akkhe code me error kaha bhi ho last me ayeaga yahi to the lat moddleware its the error handling middleware final boss

let port = 3000;

app.listen(port, (req, res) => {
    console.log(`The server is runnig at port no ${port}`);
})
