const mongoose=require("mongoose");

const reviewSchema= new mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    createdAt:{
         type: Date,
    default: Date.now 
    }
});

const review=mongoose.model("review",reviewSchema);

module.exports=review;
//here abb ye reviws jo he 
//wo kisi to perticular post ya listing ke hoge na to wo uske niche dekhne chahiye right
//one listing ke n numb of reviews ho skate 
//one to many relationshiip
//to abhi in listing.js add a array 