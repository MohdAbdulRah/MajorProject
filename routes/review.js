const express = require("express")
const router = express.Router({ mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js")
const {LoggedIn,validateReview,reviewAuthor} = require("../middleware.js")
const ReviewController = require("../Controller/review.js")


//post route
router.post("/",LoggedIn,validateReview,wrapAsync(ReviewController.postRoute))

//delete Route
router.delete("/:review_id",LoggedIn,reviewAuthor,ReviewController.deleteRoute)

module.exports = router;