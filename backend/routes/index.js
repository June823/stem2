const express = require('express')

const router = express.Router()

const userSignUpController = require("../controllers/user/userSignUp")
const userSignInController = require('../controllers/user/userSignIn')
const userDetailsController = require('../controllers/user/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controllers/user/userLogout')
const allUsers = require('../controllers/user/allUsers')
const updateUser = require('../controllers/user/updateUser')
const UploadProductController = require('../controllers/product/uploadProduct')
const getProductController = require('../controllers/product/getProduct')
const updateProductController = require('../controllers/product/updateProduct')
const deleteProduct = require('../controllers/product/deleteProduct')
const undeleteProduct = require('../controllers/product/undeleteProduct')
const getCategoryProduct = require('../controllers/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controllers/product/getCategoryWiseProduct')
const getProductDetails = require('../controllers/product/getProductDetails')
const addToCartController = require('../controllers/user/addToCartController')
const countAddToCartProduct = require('../controllers/user/countAddToCartProduct')
const addToCartViewProduct  = require('../controllers/user/addToCartViewProduct')
const updateAddToCartProduct = require('../controllers/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controllers/user/deleteAddToCartProduct')
const searchProduct = require('../controllers/product/searchProduct')
const filterProductController = require('../controllers/product/filterProduct')
const recommendations = require('../controllers/product/recommendations')
const adminOnly = require('../middleware/adminOnly')
const adminSummary = require('../controllers/admin/summary')



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