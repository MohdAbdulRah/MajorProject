const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    }

    //username and password are automatically added by passport - local - mongoose
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User",userSchema)

module.exports = User