if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express")
const app = express();
const path = require("path")
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const expressLayouts = require('express-ejs-layouts');
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const User = require("./models/user.js")
const passport = require("passport")
const LocalStratergy = require("passport-local")

const listing = require("./routes/listing.js")
const review = require("./routes/review.js")
const userRouter = require("./routes/user.js")

let mongoUrl = process.env.ATLASDB_URL

 main()
.then(()=>{
    console.log("Connection Successful")
}).catch(err => console.log(err));

async function main() {
    try {
        await mongoose.connect(mongoUrl,{
            serverSelectionTimeoutMS: 30000 
        });
        console.log("Connection Successful");
      } catch (err) {
        console.error("MongoDB connection error:", err); // This will give more details about the error
      }
}

app.use(express.urlencoded({extended : true}))
app.use(express.json())

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.static(path.join(__dirname,"public")))

const store = MongoStore.create({
    mongoUrl : mongoUrl,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24*60*60 //in seconds if in milliseconds 24*60*60*1000 but by default touchAfter is in seconds 
})

store.on("error",()=>{
    console.log("Some Error",err)
})
const secretOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
}
app.use(session(secretOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStratergy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use(methodOverride('_method'))
app.engine("engine",ejsMate)
app.use(expressLayouts);
app.set('layout', './layouts/boilerplate');

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash('success')
    res.locals.errorMsg = req.flash('error')
    res.locals.currUser = req.user //or u can also use res.locals.currUser = req.isAuthenticated() this also works
    res.locals.filter = req.flash("filter")
    next()

})

app.use("/listing",listing)
app.use("/listing/:id/review",review)
app.use("/",userRouter)

// app.get("/demoUser", async(req,res)=>{
//     const user1 = new User({
//         email : "example@gmail.com",
//         username : "delta-student"
//     })

//     const registeredUser = await User.register(user1,"sandhyaBindni")
//     res.send(registeredUser)
// })




app.get("/",(req,res)=>{
    res.send("Home Directory")
})



/*Page Not Found*/
app.use((req,res,next)=>{
    throw new ExpressError(404,"Page Not FOund")
    // res.status(404).send("Page Not Found")
})

/*Default Error Handler*/
app.use((err,req,res,next)=>{
    let {status=500,message="Some Error Occured"} = err
    res.render("error.ejs",{message})
    // res.status(status).send(message)
})

app.listen(3000,()=>{
    console.log("App is listening on 3000")
})
