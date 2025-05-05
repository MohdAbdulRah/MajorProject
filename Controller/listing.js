const Listing = require("../models/listing.js")

module.exports.index = async (req,res)=>{
    // let lists = null
    let lists = await Listing.find({})
    .then((res1)=>{
        return res1;
    })
    .catch((err)=>{
        console.log(err)
    })
    console.log(lists)
    res.render("listings/index.ejs",{lists})
}

module.exports.newRoute = (req,res)=>{
    console.log(req.user)
   
    res.render("listings/new.ejs")
}

module.exports.showRoute = async (req,res)=>{
    let { id } = req.params;

        // Find the Listing and populate reviews
        let chat = await Listing.findById(id).populate({
            path : "reviews",
            populate : {
                path : "author"
            }
        }).populate("owner");

        // If no chat found
        if (!chat) {
            req.flash("error", "Listing requested for does not exist");
            return res.redirect("/listing");
        }

        console.log(chat)
        // Render the view with chat data
        res.render("listings/view.ejs", { chat });
    
}

module.exports.postRoute = async (req,res)=>{
    let obj = req.body
    
    let url = req.file.path
    let filename = req.file.filename

    console.log(url,filename)
    console.log(obj)

    // console.log(req.user)
    let list = await Listing.insertOne({title : obj.title,description : obj.description,image : {url,filename},price : obj.price,location : obj.location,country : obj.country,owner : req.user,categories : obj.categories})
    .then((res1)=>{
        return res1
    })
    .catch((err)=>{
        throw new ExpressError(400,"Send Valid Data")
    })

    req.flash("success","A new Listing Created")
    res.redirect("/listing")

}

module.exports.deleteRoute = async (req,res)=>{
    let {id} = req.params

    let chat = await Listing.findByIdAndDelete(id)
    .then((res1)=>{
        return res1
    })
    .catch((err)=>{
        console.log(err)
    })
    req.flash("success","Listing Deleted")
    res.redirect("/listing")
}

module.exports.update = async (req,res)=>{
    let {id} = req.params
    let obj = req.body

    let chat1 = await Listing.findById(id)
    .then((res1)=>{
        return res1;
    })
    .catch((err)=>{
        console.log(err)
    })

    let url = chat1.image.url
    let filename = chat1.image.filename

    let categories = chat1.categories
    console.log(url+"...chat...."+filename)

   

    if(req.file){
        url = req.file.path
        filename = req.file.filename
        console.log(url+"..req..."+filename)
    }
    
    if(req.body.categories){
        categories = req.body.categories
    }
    let chat = await Listing.findByIdAndUpdate(id,{title : obj.title,description : obj.description,image : {url,filename} ,price: obj.price,location : obj.location,country : obj.country,categories : categories})
    .then((res1)=>{
        return res1
    })
    .catch((err)=>{
        console.log(err)
    })

    req.flash("success","Listing Updated")
    res.redirect(`/listing/${id}`)
}

module.exports.editRoute = async (req,res)=>{
    let {id} = req.params;

        
        let chat = await Listing.findById(id)

        if (!chat) {
            req.flash("error", "Listing requested for does not exist");
            return res.redirect("/listing");

        }
        
        let imageUrl = chat.image.url
         imageUrl.replace("/upload","/upload/w_250")

         // console.log(chat)
    res.render("listings/edit.ejs",{chat,imageUrl})
    
}
