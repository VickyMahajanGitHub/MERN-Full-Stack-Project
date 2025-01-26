const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema");
const Listing = require("../models/listing");
const Review = require("../models/reviews");
const {
  isloggedIn,
  isOwner,
  validateListing,
  validateReview,
} = require("../middleware");

const listingController = require("../controllers/listings");
const { render } = require("ejs");
// const express = require('express')
const multer = require("multer");
const { storage, cloudinary } = require("../cloudConfig");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isloggedIn,
    
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  ); // its index & create route


// New route API
router.get("/new", isloggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isloggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isloggedIn, isOwner, wrapAsync(listingController.destroyListing)); // Show,Update & Delete Route

// EDIT ROUTE API
router.get(
  "/:id/edit",
  isloggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
