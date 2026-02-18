const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");

const session=require("express-session");
const flash = require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");

const User = require("./models/user.js");




const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");   //this is the pakage used for whatver we did with bolerplate and other ejs files like ekk kiya design and then sabko usse hu banaya
const expressError = require("./utils/expressError.js");

const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);



//session>> 

const sessionOptions = {
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
        
    }

}

app.use(session(sessionOptions));
    //always write everything od session and connect flash before routes 
    //coz routes are going to use them right so unse pehele hi chahiyee>>>>>>>
app.use(flash());


//here sara passport ka configration set karte hue>>

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    //we know that res.locals can be direct accessed in ejs so issiliye logout and login ka logic likhne ke liye ye use karr rahe 
    res.locals.currentUser=req.user;
    //chahe to ekk seprate middleware bhi bana sakte 
    //but he to kyu
    next();

})  
 


// app.get("/demoUser",async (req,res)=>{
//     const newUser=new User({
//         email:"sank@gmail.com",
//         username:"kahipani"
//     })

//    let xyz=await User.register(newUser,"helloworld");
//    res.send(xyz);

// });







app.use("/listings/:id/reviews", reviewRouter);
app.use("/listings", listingsRouter);
app.use("/",userRouter);


 
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
});