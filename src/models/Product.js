const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({

    restaurantId: {
        type: Number,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    ingredients: {
        type: [],
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product