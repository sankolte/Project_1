const mongoose = require("mongoose");
const Schema=mongoose.Schema;            //we used that reviews array there issliye ye chanhuye

const review=require("./review.js");


const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  image: {
    filename: {
      type: String,
      default: "listingimage",
      set: v => v === "" ? "listingimage" : v
    },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2100b?auto=format&fit=crop&w=800&q=60",
      set: v => v === ""
        ? "https://unsplash.com/photos/low-angle-photo-of-hotel-lighted-signage-on-top-of-brown-building-during-nighttime-n_IKQDCyrG0"
        : v
    }
  },

  country: {
    type: String
  },
  reviews:[
    {
     type:Schema.Types.ObjectId,
    ref:"review"
    }
  ]
    //one to many
  
});

listingSchema.post("findOneAndDelete", async(data)=>{
  if(data){
  await review.deleteMany({_id:{$in:data.reviews}});      //basically delete all documenst where id is in data madhlya array mhanje basically jyana pan id asel te delete ya it is actually this simple hume sirf ekk logic chahiye tha 

  }

})


const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;
