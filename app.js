const express=require("express");
const mongoose =require("mongoose");
const app =express();
const path =require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");   //this is the pakage used for whatver we did with bolerplate and other ejs files like ekk kiya design and then sabko usse hu banaya
const wrapAsync=require("./utils/wrapAsync.js");                      
const expressError=require("./utils/expressError.js");  
// const  listingSchema =require("./schema.js");
// const reviewSchema=require("./schema.js");

const {listingSchema,reviewSchema}=require("./schema.js");   //right way to do it coz abb do do he jinhe hum export karr rahe waha se 




const listing=require("./models/listing.js");
const review=require("./models/review.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);



main()
    .then(()=>{
        console.log("connection succesful !!");

    })
    .catch((err)=>{
        console.log(err);
    })


async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/come_and_live');

}

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
 
    //for reviews

const validateReview=(req,res,next)=>{
    let result=reviewSchema.validate(req.body);
     let {error}=result;

        console.log(error);
        if(error){
            let errmsg=error.details.map((el)=>el.message).join(",");       
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

    app.get("/listings",wrapAsync(async (req,res)=>{

    const all_listings=await listing.find();
    res.render("listings/index.ejs",{ all_listings});
    console.log("ok data is sent to ejs file ");
    
   
}))


       //create new route >> basically create new listing

    app.post("/listings",validateListing,wrapAsync(async(req,res)=>{            
          //basically wo validateListing func ko as a middleware pass kiya
     
    //   const { title, description, image, price, location, country } = req.body;
    //   const data = new listing({
    //       title,
    //       description,
    //       image: { url: image, filename: "listingimage" },
    //       price,
    //       location,
    //       country
    //   });
    //   await data.save();
        const newListing=new listing(req.body.listing);
        await newListing.save();
      res.redirect("/listings");
     
   
    }));

    app.get("/listings/new",(req,res)=>{
        res.render("listings/new.ejs");
        
    })

    //displaying a perticular se;ected listing

    app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
      const one=await listing.findById(id);
      res.render("listings/show.ejs",{one});
    
    }));

    //reviews ki gandmasti ke liye>>>
    //post route

    app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
        //abb dekho idhar hume pehel ye id ka listing find karni he ok then iss listing me hume
        // review add karna he 
        //basically listing ke collection me hume uss reviews ke array me ye naya review add karna he 

        
        let {id}=req.params;
        let Listing= await listing.findById(id);
        let newReview=new review(req.body.review);  //wo hume review[rating] and review[comment] kiya na to basically easy hogaya
        
        Listing.reviews.push(newReview);

        await newReview.save();
        await Listing.save();
        //basically abb wo array add hua he na listing collection ke under usko firse save karana padega
        console.log("new review saved !!");

        res.redirect("/listings");


      }))



    //editing and updating ke liye firstly to render a form 

    app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
      

        let {id}=req.params;
        const two=await listing.findById(id);
        res.render("listings/edit.ejs",{two});
        
      
    
    }));

    

    app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    
        let {id} =req.params;
        // const { title, description, image, price, location, country } = req.body;
        // const updateData = {
        //     title,
        //     description,
        //     image: { url: image, filename: "listingimage" },
        //     price,
        //     location,
        //     country
        // };
        // const saveData = await listing.findByIdAndUpdate(id, updateData);
        // console.log("data updated in db");

         await listing.findByIdAndUpdate(id,{...req.body.listing});
        res.redirect("/listings");
 
    }));
     


        //deleting route>>>>>>>>>>>>>

    app.delete("/listings/:id",wrapAsync(async (req,res)=>{
        let {id}=req.params;
       const deletedData= await listing.findByIdAndDelete(id);
        res.redirect("/listings");
        console.log(deletedData);
    
    
    }));

//this error handling middleware for perticularly managing page not found errror 
    app.use( (req,res,next)=>{
        next(new expressError(404,"Page not found!"))

    })

    // error handling middlewares >>  used by express like anything happens in the app express sidah comes to this coz wrapasync ke karan sab ka catch me yahi he 
    app.use((err,req,res,next)=>{
        let {statusCode,message}=err;
       // res.status(statusCode).send(message);
        res.render("error.ejs",{ message });

       // res.send("Something went wrong !!");

    })
//akkhe code me error kaha bhi ho last me ayeaga yahi to the lat moddleware its the error handling middleware final boss

let port=3000;

app.listen(port,(req,res)=>{
    console.log(`The server is runnig at port no ${port}`);
})
