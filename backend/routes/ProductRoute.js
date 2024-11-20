const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productControlers");
const { isAuthUser , authorizeRoles} = require("../middleware/Auth");

const router = express.Router();


router.route("/products").get( getAllProducts);

router.route("/admin/products/new")
.post(isAuthUser,authorizeRoles("admin"),createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthUser,authorizeRoles("admin"),updateProduct)
  .delete(isAuthUser,authorizeRoles("admin"),deleteProduct)

  router.route("/product/:id").get(getProductDetails)
  // both are same
// router.route("/product/:id").put(updateProduct)
// router.route("/product/:id").delete(deleteProduct)
// router.route("/product/:id").get(getProductDetails)

 router.route("/review").put(isAuthUser ,createProductReview)

 router.route("/reviews").get(getProductReviews).delete(isAuthUser, deleteReview)

module.exports = router;
