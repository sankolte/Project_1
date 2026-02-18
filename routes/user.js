const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const {saveRedirectUrl} =require("../middleware.js");     


 //getting a form for sign up

router.get("/signup",(req,res)=>{
    // res.send("yehooo")
   res.render("users/signup.ejs");
   

});

// posting a form like saving it in a db and managing workflow

router.post("/signup",async(req,res)=>{
        try{
            let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registerUser= await User.register(newUser,password);
        console.log(registerUser);

            //sign up ke baad automatically log in ka logicm..

            req.login(registerUser,(err)=>{
                if(err){
                    return next(err);
                    
                } else{
                 req.flash("success","welcome to Come And Live !!");
                res.redirect("/listings");
                }
            })

        }
        catch(e){
            req.flash("error",e.message);
            res.redirect("/listings");


        }

})

//setting up login ka sab kuch
//firstly a get req so that form mele

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");

});

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),(req,res)=>{
                        //passing it as a middleware>>
    req.flash("success","User Logged In !");


        //agar saveRedirectUrl middleware trigger hua hi nahi matlab agar logged in nahi he user wo wala page aya hi nahi and mene sidha login pe click kar lita home page pe hi tp

        let redirectUser=res.locals.redirectUrl || "/listings";

    res.redirect(redirectUser);


    
})

// user ko logout karao>>
router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        } else{
            req.flash("success","user logged out !!");
            res.redirect("/listings");
            
        }
    })

})

module.exports=router;

