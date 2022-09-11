const mongoose = require("mongoose");

const opinionSchema = mongoose.Schema({
    content: { type: String, required: true },
    likes: { type: Number, required: true },
    author: {type:String,required:true}
});

module.exports = mongoose.model("Opinion", opinionSchema);