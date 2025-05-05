const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js")

module.exports.LoggedIn = (req,res,next) =>{
    let url = req.originalUrl
    
    if(!req.isAuthenticated()){
        console.log(req.originalUrl)
        req.session.redirectUrl = req.originalUrl
        console.log(req.session)

        
        req.flash("error","you must be logged in")
        return res.redirect("/login")
    }

    // res.redirect(url)
    next()
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }

    next()
}

module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params
    const listing = await Listing.findById(id);
    if(!req.user || req.user._id.toString() != listing.owner._id.toString()){
             req.flash("error","you are not the owner of this listing")
             return res.redirect(`/listing/${id}`)
    }

    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.reviewAuthor = async (req,res,next) =>{
    let {id,review_id} = req.params

    let review = await Review.findById(review_id)
    if(review.author._id.toString() != req.user._id.toString()){
        req.flash("error","You are not the author of this review")
        return res.redirect(`/listing/${id}`)
    }

    next()
}