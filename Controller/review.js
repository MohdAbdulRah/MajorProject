const Listing = require("../models/listing.js")
const Review = require("../models/review.js")

module.exports.postRoute = async (req,res)=>{
    let {id} = req.params
    let {comment,rating} = req.body
    
   try{
    let review = new Review({comment,rating});
    review.author = req.user._id;

    console.log(review)
    let chat = await Listing.findById(id)
    chat.reviews.push(review)


    await review.save()

   
    await chat.save()

    console.log(chat)

    console.log("After Pushing")

    req.flash("success","A new Review Created")


    res.redirect(`/listing/${id}`)
   }
   catch(err){
      console.log(err)
   }

}

module.exports.deleteRoute = async (req,res) =>{
    let {id,review_id} = req.params
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : review_id}})
    await Review.findByIdAndDelete(review_id)

    req.flash("success","Review Deleted")
    res.redirect(`/listing/${id}`)
}