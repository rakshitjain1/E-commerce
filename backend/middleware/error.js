const ErrorHandler = require("../utils/errorhandler")



module.exports = (err ,req ,res, next ) => {

    err.statuscode = err.statuscode|| 500;
    err.message = err.message || " internal server error";


    //wrong mongodb  id error 

     if(err.name === "CastError"){
        const message = ` resource Not found. Invalid ${err.path} `;
        err = new ErrorHandler(message, 400)
     }

     // mongoose duplicate error 

     if(err.code === 11000){
        const message = `duplicate ${Object.keys(err.keyValue)} entered `
        err = new ErrorHandler(message, 400)
     }

       // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

   // JWT EXPIRE error
   if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }
    

    res.status(err.statuscode).json({
        success : false,
        message : err.message,
        // error : err,
        // error : err.stack // all location in show in error
    })



}