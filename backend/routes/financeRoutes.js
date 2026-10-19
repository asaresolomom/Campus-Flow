const express = require("express");

const router = express.Router();



const {

addFinance,

getFinance,

deleteFinance


}=require("../controllers/financeController");





router.post(
"/add",
addFinance
);



router.get(
"/all",
getFinance
);



router.delete(
"/:id",
deleteFinance
);





module.exports = router;