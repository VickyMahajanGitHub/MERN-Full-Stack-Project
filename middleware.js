const Listing=require("./models/listing");
const Review = require("./models/reviews");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");

module.exports.isloggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
      //redirect saved url
      req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create a listing.");  
        return res.redirect("/login");
      }
      next();
    };

    module.exports.saveRedirectUrl = (req, res, next) => {
      if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
      }
      next();
    };

    module.exports.isOwner = async (req, res, next) => {
      let { id } = req.params;
      let listing=await Listing.findById(id);
      // listing authorization
      if(!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error","You do not own this listing.");
        return res.redirect(`/listings/${id}`);
      }
      next();
    };


module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Validate Review
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let {id, reviewId } = req.params;
  let review=await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currentUser._id)) {
    req.flash("error","You are not the author of this review.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
