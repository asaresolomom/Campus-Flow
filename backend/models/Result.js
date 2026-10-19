const mongoose = require("mongoose");


const resultSchema = new mongoose.Schema(

{
    student:{

        type: mongoose.Schema.Types.ObjectId,

        ref: "Student",

        required:true

    },


    exam:{

        type: mongoose.Schema.Types.ObjectId,

        ref: "Exam",

        required:true

    },


    subject:{

        type: mongoose.Schema.Types.ObjectId,

        ref: "Subject",

        required:true

    },


    marksObtained:{

        type:Number,

        required:true

    },


    totalMarks:{

        type:Number,

        required:true

    },


    teacherComment:{

        type:String,

        default:""

    },


    school:{

        type: mongoose.Schema.Types.ObjectId,

        ref:"School",

        required:true

    }


},

{

    timestamps:true

}

);





const Result = mongoose.model(
    "Result",
    resultSchema
);





module.exports = Result;