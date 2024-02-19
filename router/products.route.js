const express = require("express");
const productController = require("../controllers/product.controller");
const verifyToken = require("../middleware/verifyToken")
const roles = require("../utils/roles")
const checkRoles = require("../middleware/checkRoles")
const router = express.Router();
//controller it's place for handle our requests
//router.route('write the url that all request is linked togther)
router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);
//tihs for get product with id
router
  .route("/:id")
  .get(productController.getProductByID)
  //for send data with post method
  //to add validation in payload use middleware between url and (req,res) function
  //patch ==> to update one key
  //put ==> to update all keys
  .patch(productController.updateProduct)
  .delete(verifyToken, checkRoles(roles.ADMIN, roles.MANGER), productController.deleteProduct);
module.exports = router;