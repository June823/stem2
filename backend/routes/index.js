const express = require('express')

const router = express.Router()

const userSignUpController = require("../controllers/user/userSignUp.js")
const userSignInController = require('../controllers/user/userSignIn.js')
const userDetailsController = require('../controllers/user/userDetails.js')
const authToken = require('../middleware/authToken')
const userLogout = require('../controllers/user/userLogout.js')
const allUsers = require('../controllers/user/allUsers.js')
const updateUser = require('../controllers/user/updateUser.js')
const UploadProductController = require('../controllers/product/uploadProduct.js')
const getProductController = require('../controllers/product/getProduct.js')
const updateProductController = require('../controllers/product/updateProduct.js')
const deleteProduct = require('../controllers/product/deleteProduct.js')
const undeleteProduct = require('../controllers/product/undeleteProduct.js')
const getCategoryProduct = require('../controllers/product/getCategoryProductOne.js')
const getCategoryWiseProduct = require('../controllers/product/getCategoryWiseProduct.js')
const getProductDetails = require('../controllers/product/getProductDetails.js')
const addToCartController = require('../controllers/user/addToCartController.js')
const countAddToCartProduct = require('../controllers/user/countAddToCartProduct.js')
const addToCartViewProduct  = require('../controllers/user/addToCartViewProduct.js')
const updateAddToCartProduct = require('../controllers/user/updateAddToCartProduct.js')
const deleteAddToCartProduct = require('../controllers/user/deleteAddToCartProduct.js')
const searchProduct = require('../controllers/product/searchProduct.js')
const filterProductController = require('../controllers/product/filterProduct.js')
const recommendations = require('../controllers/product/recommendations.js')
const adminOnly = require('../middleware/adminOnly')
const adminSummary = require('../controllers/admin/summary.js')



router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)

//admin panel 
router.get("/all-user",authToken,adminOnly,allUsers)
router.post("/update-user",authToken,adminOnly,updateUser)

//product
router.post("/upload-product",authToken,adminOnly,UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product",authToken,adminOnly,updateProductController)
router.post('/delete-product', authToken, adminOnly, deleteProduct)
router.post('/undelete-product', authToken, adminOnly, undeleteProduct)
router.get("/get-categoryProduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.get("/search",searchProduct)
router.post("/filter-product",filterProductController)
router.get('/recommendations', recommendations)
// admin summary / dashboard counts
router.get('/admin/summary', authToken, adminOnly, adminSummary)

//user add to cart
router.post("/addToCart",authToken,addToCartController)
router.get("/countAddToCartProduct",authToken,countAddToCartProduct)
router.get("/view-card-product",authToken,addToCartViewProduct)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",authToken,deleteAddToCartProduct)







module.exports = router
