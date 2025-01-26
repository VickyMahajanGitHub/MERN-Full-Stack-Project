const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/reviews.js");
const Listing=require("../models/listing");
const {validateReview, isloggedIn, isReviewAuthor} = require("../middleware");
const reviewController=require("../controllers/reviews");

// Post Reviews Route
router.post(
  "/",
  isloggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Delete Review Route
router.delete(
  "/:reviewId",
  isloggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
