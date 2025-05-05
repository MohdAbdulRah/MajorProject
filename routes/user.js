const express = require("express")
const router = express.Router({mergeParams : true})
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../Controller/user.js")

router.route("/signup")
  .get(userController.signUp) //signupForm
  .post(wrapAsync(userController.signUpPost)) //signUpPost


router.get("/allUsers",async (req,res)=>{
     let users = await User.find({})

     res.send(users)
})


router.route("/login")
   .get(userController.logIn) //login
   .post(saveRedirectUrl,passport.authenticate("local" , {failureRedirect : "/login",failureFlash:true}),userController.authenticate)
    //authenticate

//logOut
router.get("/logout",userController.logOut)

module.exports = router