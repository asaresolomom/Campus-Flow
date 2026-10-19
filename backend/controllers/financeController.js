const Finance = require("../models/Finance");




// ADD PAYMENT

exports.addFinance = async(req,res)=>{


try{


const finance = await Finance.create({

    student:req.body.student,

    amount:req.body.amount,

    term:req.body.term,

    status:req.body.status


});



res.status(201).json({

    message:"Payment added successfully",

    finance

});



}catch(error){


console.log(error);


res.status(500).json({

    message:error.message

});


}


};







// GET ALL PAYMENTS

exports.getFinance = async(req,res)=>{


try{


const finance = await Finance.find()

.populate(
    "student",
    "firstName lastName"
);



res.status(200).json({

    finance

});



}catch(error){


console.log(error);


res.status(500).json({

    message:error.message

});


}


};








// DELETE PAYMENT


exports.deleteFinance = async(req,res)=>{


try{


await Finance.findByIdAndDelete(

req.params.id

);



res.json({

message:"Payment deleted"

});



}catch(error){


res.status(500).json({

message:error.message

});


}


};