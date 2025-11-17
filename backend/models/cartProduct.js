const mongoose = require('mongoose')

const addToCart = mongoose.Schema({
    productId : {
          type: mongoose.Schema.Types.ObjectId,
          ref : 'Product',
    },
    quantity : { type: Number, default: 1 },
    userId : { type: String, required: true },
},{
    timestamps : true
})


const addToCartModel = mongoose.model("addToCart",addToCart)

module.exports = addToCartModel