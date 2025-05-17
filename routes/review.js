const express = require("express");
const router = express.Router({mergeParams: true});
const wrapasync = require("../utils/wrapasync.js");
const expresserror = require("../utils/expresserror.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expresserror(400, errMsg);
    } else {
        next();
    }
};

// Reviews Post route
router.post("/", isLoggedIn,wrapasync(async (req, res) => {
    
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review created!");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete review route
router.delete("/:reviewId",isLoggedIn, wrapasync(async (req, res) => {
    let { id, reviewId } = req.params;
    reviewId = reviewId.trim(); // Trim any extra whitespace

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," listing Deleted!");

    res.redirect(`/listings/${id}`);
}));

module.exports = router;