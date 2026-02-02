const mongoose = require("mongoose");

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
      default: "https://unsplash.com/photos/low-angle-photo-of-hotel-lighted-signage-on-top-of-brown-building-during-nighttime-n_IKQDCyrG0",
      set: v => v === ""
        ? "https://unsplash.com/photos/low-angle-photo-of-hotel-lighted-signage-on-top-of-brown-building-during-nighttime-n_IKQDCyrG0"
        : v
    }
  },

  country: {
    type: String
  }
});

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;
