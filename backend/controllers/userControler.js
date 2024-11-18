const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
 const User = require("../models/userModel")
 const sendToken = require("../utils/JWTToken")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")


 exports.registerUser = catchAsyncErrors(async (req ,res,next) =>{

   const {name , email, password} = req.body;

    const user = await User.create({

       name,email,password,
       avatar:{
           public_id:"this is a sample id",
           url: "profile pic url",
        }
    });
 
    sendToken(user , 201 , res)
    
 })


// // Login User

exports.loginUser = catchAsyncErrors( async(req , res ,next)=>{

     const { email , password} = req.body;

     // checking if user has given password and email both

     if( !email || !password){
      return next( new ErrorHandler("please enter Email & Password",400))
     }

     const user =  await User.findOne({email}).select("+password");

     if(!user){
      return next ( new ErrorHandler("Invaild Email or Password",401))
     }

     const isPasswordMatched = await user.comparePassword(password);

     
     if(!isPasswordMatched){
      return next ( new ErrorHandler("Invaild Email or Password",401))
     }

     sendToken(user , 200 , res)
     
})


// logout User  
exports.Logout = catchAsyncErrors(async (req, res, next) => {
   res.cookie("token", null, {
     expires: new Date(Date.now()),
     httpOnly: true,
   });
 
   res.status(200).json({
     success: true,
     message: "Logged Out",
   });
 });


 //forgot password 

 exports.forgotPassword  =catchAsyncErrors(async (req, res ,next)=>{
  const user  = await User.findOne({email:req.body.email});

   if( !user){
    return next(new ErrorHandler("user not found",400))
   }


   // Get ResetPassword Token

   const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});


//reset password

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get User Details 

exports.getUserDetails = catchAsyncErrors (async (req, res , next)=>{

   const user = await User.findById(req.user.id)

   res.status(200).json({
    success: true,
    user
  });

})

// update user password

exports.updateUserPassword = catchAsyncErrors (async (req, res , next)=>{

   const user = await User.findById(req.user.id).select("+password")

   const isPasswordMatched = user.comparePassword(req.body.Oldpassword);

     
   if(!isPasswordMatched){
    return next ( new ErrorHandler("Old Passsword is invalid ",400))
   }

   if(req.body.newPassword !== req.body.comfirmPassword)
   {
    return next ( new ErrorHandler("Password does not match ",400))
   }

    user.password =req.body.newPassword ;
    
    await user.save();

  sendToken(user ,200 ,res);


})


// update user proflie

exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});


// Get all Users (admin)

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});


// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});



// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  // const imageId = user.avatar.public_id;
  // await cloudinary.v2.uploader.destroy(imageId);

  await User.findByIdAndDelete(req.params.id); // Use findByIdAndDelete instead of user.remove()

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
