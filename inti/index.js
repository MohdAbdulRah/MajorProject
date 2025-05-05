const mongoose = require('mongoose');
const Listing = require("../models/listing.js")
const data = require("./data.js")

main()
.then(()=>{
    console.log("Connection Successful")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


data.data = data.data.map((obj) => ({
    ...obj,
    owner : '68145723cd310947ceec4229'
}))
Listing.insertMany(data.data)
.then((res)=>{
    console.log(res)
})
.catch((err)=>{
    console.log(err)
})



