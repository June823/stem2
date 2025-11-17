const productModel = require("../../models/productModel")

const filterProductController = async(req,res)=>{
 try{
        const categoryList = req?.body?.category || []

        console.log("🔍 Filter request - categories:", categoryList);
        console.log("📋 Request body:", req.body);

        const product = await productModel.find({
            category :  {
                "$in" : categoryList
            }
        })

        console.log(`✅ Found ${product.length} products for categories:`, categoryList);

        // Debug: Show what categories exist if no products found
        if (product.length === 0 && categoryList.length > 0) {
            const allCategories = await productModel.distinct("category");
            console.log("⚠️ No products found. Available categories in DB:", allCategories);
            console.log("🔍 Looking for:", categoryList);
        }

        res.json({
            data : product,
            message : "product",
            error : false,
            success : true
        })
 }catch(err){
    console.error("❌ Error in filterProduct:", err);
    res.json({
        message : err.message || err,
        error : true,
        success : false,
        data: []
    })
 }
}

module.exports = filterProductController
