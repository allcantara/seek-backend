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

    code: {
        type: String,
        required: true,
        unique: false,
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
})

const ItemPurchase = mongoose.model('ItemPurchase', ItemPuchaseSchema)

module.exports = ItemPurchase