const mongoose = require("mongoose");


const financeSchema = new mongoose.Schema({

    student:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Student",

        required:true

    },


    amount:{

        type:Number,

        required:true

    },


    term:{

        type:String,

        required:true

    },


    status:{

        type:String,

        enum:["Paid","Pending"],

        default:"Paid"

    },


    date:{

        type:Date,

        default:Date.now

    }


},{
    timestamps:true
});



module.exports = mongoose.model(
    "Finance",
    financeSchema
);