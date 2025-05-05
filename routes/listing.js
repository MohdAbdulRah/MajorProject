const express = require("express")
const router = express.Router();
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema,reviewSchema} = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const {LoggedIn,isOwner,validateListing} = require("../middleware.js")
const ListingController = require("../Controller/listing.js") //or you can const {index,new} = require("../Controller/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(ListingController.index))//index
.post(LoggedIn,upload.single('image'),validateListing,wrapAsync(ListingController.postRoute))//post




//newRoute
router.get("/new",LoggedIn,ListingController.newRoute)


router.route("/:id")
 .get(wrapAsync(ListingController.showRoute)) //show
 .delete(LoggedIn,isOwner,ListingController.deleteRoute) //delete
 .patch(LoggedIn,isOwner,upload.single('image'),wrapAsync(ListingController.update)) //patch

 

//edit
router.get("/:id/edit",LoggedIn,isOwner,wrapAsync(ListingController.editRoute))

module.exports = router;