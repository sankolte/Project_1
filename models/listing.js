const mongoose = require("mongoose");
const Schema=mongoose.Schema;            //we used that reviews array there issliye ye chanhuye

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

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;
