const mongoose = require("mongoose");

const categories = new mongoose.Schema(
    {
        
        name:{
            type:String,
            required:true,
            maxLength:255
        },  
        parentId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required:false,
        },
    },
    {
        timestamps:true
    }
);
module.exports = mongoose.model("Category", categories);