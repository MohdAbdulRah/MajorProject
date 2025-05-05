const User = require("../models/user.js")

module.exports.signUp = (req,res)=>{
    res.render("users/user.ejs")
}

module.exports.signUpPost = async (req,res)=>{

    try {
        let {email,username,password} = req.body
        // console.log(email,username,password)
        const user1 = new User({
            email : email,
            username : username
        })
        const registeredUser = await User.register(user1,password)
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }

            req.flash("success","welcome to wanderlust")
            res.redirect("/listing")
        })
       
    }
    catch(err){
        req.flash("error",err.message)
        res.redirect("/signup")
    }
    
}

module.exports.logIn = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.authenticate = async (req,res)=>{
    console.log(req.session.redirectUrl)
    req.flash("success","welcome back to WanderLust,You are logged in")
    let redirectUrl = res.locals.redirectUrl || "/listing"
     res.redirect(redirectUrl)
  
  }

module.exports.logOut = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }

        req.flash("success","you are logged out")
        res.redirect("/listing")
    })
}