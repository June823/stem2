const addToCartModel = require("../../models/cartProduct")

const deleteAddToCartProduct = async(req,res)=>{
    try{
        const currentUserId = req.userId 
        const addToCartProductId = req.body._id

        // delete only if the cart item belongs to the authenticated user
        const deleteProduct = await addToCartModel.deleteOne({ _id: addToCartProductId, userId: currentUserId })

        if (deleteProduct.deletedCount === 0) {
            return res.status(404).json({
                message: "Cart item not found or not owned by user",
                error: true,
                success: false
            })
        }

        res.json({
            message : "Product Deleted From Cart",
            error : false,
            success : true,
            data : deleteProduct
        })

    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = deleteAddToCartProduct