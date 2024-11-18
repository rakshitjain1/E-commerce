const express = require("express");
const { registerUser, loginUser, Logout, forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateUserProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userControler");
const router = express.Router();

const { isAuthUser , authorizeRoles} = require("../middleware/Auth");

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/password/forget").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)

router.route("/logout").get(Logout)


router.route("/me").get( isAuthUser,getUserDetails)

router.route("/password/update").put( isAuthUser,updateUserPassword)

router.route("/me/update").put( isAuthUser,updateUserProfile)


router
.route("/admin/users")
.get( isAuthUser,authorizeRoles("admin"),getAllUser)

router
.route("/admin/user/:id")
.get( isAuthUser,authorizeRoles("admin"),getSingleUser).put(isAuthUser , authorizeRoles("admin"),updateUserRole).delete(isAuthUser , authorizeRoles("admin"),deleteUser)







module.exports = router