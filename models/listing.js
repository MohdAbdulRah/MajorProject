const mongoose = require('mongoose');

const Review = require("./review.js")
const User = require("./user.js")
const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    image : {
      url : String,
      filename : String
    },
    price : {
        type : Number
    },
    location : {
        type : String
    },
    country : {
        type : String
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Review'
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    categories: {
        type: [String],  
        enum: ['trending','room','BeachFronts','Tropical','mountain','Towers','arctic','boats','play','skiing'],  // Only these two values are allowed
        required: true
      }
})
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing.reviews.length){
       let res = await Review.deleteMany({_id : {$in : listing.reviews}})
       console.log(res)
    }
})
const Listing = mongoose.model("Listing",listingSchema)
module.exports = Listing