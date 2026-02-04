const express = require("express");
const router = express.Router({ mergeParams: true });    // we ahve :id right so uss ke liye params ko preserve rakhne ke liye we use this >>

const wrapAsync = require("../utils/wrapAsync.js");  
const expressError = require("../utils/expressError.js");
const review = require("../models/review.js");
const listing = require("../models/listing.js");    //yes isme listinng bhi require kar lo coz fir create route ne wo bhi lagta he 
const { reviewSchema } = require("../schema");

// validation
const validateReview = (req,res,next)=>{
  let { error } = reviewSchema.validate(req.body);
  if(error){
    let msg = error.details.map(el=>el.message).join(",");
    throw new expressError(400,msg);
  }
  next();
};

// CREATE REVIEW
router.post("/", validateReview, wrapAsync(async(req,res)=>{
  let { id } = req.params;
  let Listing = await listing.findById(id);
  
  let newReview = new review(req.body.review);

  Listing.reviews.push(newReview);
  await newReview.save();
  await Listing.save();

  res.redirect(`/listings/${id}`);
}));

// DELETE REVIEW
router.delete("/:reviewId", wrapAsync(async(req,res)=>{
  let { id, reviewId } = req.params;

  await listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
  });

  await review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));

module.exports = router;