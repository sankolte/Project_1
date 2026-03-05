const express=require("express");

const {storage}=require("../cloudconfig.js");

const multer=require("multer");
// const upload = multer({ dest: "uploads/" });
const upload = multer({ storage });

const router =express.Router();
const wrapAsync=require("../utils/wrapAsync.js");  
const {listingSchema}=require("../schema.js");   //right way to do it coz abb do do he jinhe hum export karr rahe waha se
const expressError=require("../utils/expressError.js");


const listing=require("../models/listing.js");

const {isLoggedIn}=require("../middleware.js");
const {isOwner} = require("../middleware.js");




const validateListing=(req,res,next)=>{
     let result=listingSchema.validate(req.body);
     let {error}=result;

        console.log(error);
        if(error){
            let errmsg=error.details.map((el)=>el.message).join(",");       //basically jer multiple goshti alyat in error msg then usko map function se and join se sab ekk sath print karr sakte
            throw new expressError(400,errmsg);
            
        }else{
            next();
        }
}
 

// app.get("/listings",async (req,res)=>{
//     const a =new listing({
//         title:"grand palace",
//         information:"a nice place to stay",
//         price:1200,
//         image:"https//unsplash.com/photos/white-bed-linen-with-throw-pillows-Yrxr3bsPdS0",
//         address:"Sakhare vasti road,hingewadi,pune"
//     })
//     await a.save()
//     res.send("cool");
// })

//first route for showing of all listings 
//index route

    router.get("/",wrapAsync(async (req,res)=>{

    let searchQuery = {};
    
    if (req.query.search) {
        searchQuery = {
            $or: [
                { title: { $regex: req.query.search, $options: 'i' } },
                { location: { $regex: req.query.search, $options: 'i' } },
                { country: { $regex: req.query.search, $options: 'i' } }
            ]
        };
    }

    const all_listings=await listing.find(searchQuery);
    res.render("listings/index.ejs",{ all_listings});
    console.log("ok data is sent to ejs file ");
    
   
}))


       //create new route >> basically create new listing

    router.post("/", upload.single("image"),validateListing,wrapAsync(async(req,res)=>{            
          //basically wo validateListing func ko as a middleware pass kiya
     
        
        const newListing=new listing(req.body.listing);
        
        //but now we have added a new field owner in whcih username hume print karana he but here wo form me nahi he to req.body.listing usse acces nahi kar sakte 
        newListing.owner = req.user._id;
        //here newlisting me owner add kiya and usme req.user jo hota he passport ki badolat usse if le li to bascially populat karega tab ajjeyga sab 
        
        // Fix: Use Cloudinary URL from req.file.path
        if(req.file) {
            newListing.image = {
                filename: req.file.filename,
                url: req.file.path  // Cloudinary URL
            };
        }
        
        await newListing.save();
        req.flash("success","Listing created succesfully");
      res.redirect("/listings");
     
   
    }));


    //ha ahe new listing cha but for optimisig cdoe like more specific routes upper issi liye ye yaha likha he
    router.get("/new",isLoggedIn,(req,res)=>{

             res.render("listings/new.ejs");
        
        
    })

   

    
        //editing and updating ke liye firstly to render a form 
    
        router.get("/:id/edit",isOwner,isLoggedIn,wrapAsync(async (req,res)=>{
          
    
            let {id}=req.params;
            const two=await listing.findById(id);
            if(!two){
                req.flash("error","The listing does not exist !!");
                res.redirect("/listings");
            }

            res.render("listings/edit.ejs",{two});
            
          
        
        }));
    
        
     //displaying a perticular se;ected listing

    router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
      const one=await listing.findById(id).populate("owner")
                                          .populate({path:"reviews",populate:{
                                            path:"author"
                                          }});
                                          //nesting of populate idhar  >>   listing --> ke ander reviews -->ke ander  author
      
      if(!one){
          req.flash("error","The listing does not exist !!");
                res.redirect("/listings");
      }

      res.render("listings/show.ejs",{one});
    
    }));

    //actuall updating ka kaam
        // router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
        
        //     let {id} =req.params;
            
        //      await listing.findByIdAndUpdate(id,{...req.body.listing});   //...req.body.listing basically tells ki The spread operator ... takes all properties of an object and spreads them into another object.
        //        req.flash("success","listeing updated !");

        //     res.redirect("/listings");
     
        // }));
         
    //this was the orignal route before routing 
      router.put("/:id",isOwner,validateListing,wrapAsync(async (req,res)=>{
        
            let {id} =req.params;

        //    let list= await listing.findById(id);
       
        //    if(!list.owner.equals(req.user._id)){                           //basically sabse pehele id nikala and then usko check kiya ki jo owner he wo current user ke same he ya nahi 
        //         req.flash("error","user is not authorised for updating");
        //         return res.redirect(`/listings/${id}`);                          //return kiya coz firr ageke cheese exicute honge nhi to fir we know return ends the fuc  

        //    } chup chap middleware bananoo pass karo
            
             await listing.findByIdAndUpdate(id,{...req.body.listing});   //...req.body.listing basically tells ki The spread operator ... takes all properties of an object and spreads them into another object.
               req.flash("success","listeing updated !");

             res.redirect(`/listings/${id}`);
     
        }));
         
    
            //deleting route>>>>>>>>>>>>>
    
        router.delete("/:id",isOwner,isLoggedIn,wrapAsync(async (req,res)=>{
            let {id}=req.params;
           const deletedData= await listing.findByIdAndDelete(id);
           req.flash("success","listeing deleted");
            res.redirect("/listings");
            console.log(deletedData);
        
        
        }));



        router.get("/search", async (req, res) => {  
           let { q } = req.query;  

           let searches= await Listing.find({  
           location: { $regex: q, $options: "i" }  
           });  

           res.render("listings/index.ejs", { searches });  
         });



        module.exports=router;

