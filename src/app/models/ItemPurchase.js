const mongoose = require('mongoose')

const ItemPuchaseSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        unique: false,
    },

    amount: {
        type: Number,
        required: true
    },
})

const ItemPurchase = mongoose.model('ItemPurchase', ItemPuchaseSchema)

module.exports = ItemPurchase