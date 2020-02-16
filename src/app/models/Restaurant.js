const mongoose = require('mongoose')

const RestaurantSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],

    name: {
        type: String,
        required: true,
        unique: true,
    },

    addressName: {
        type: String,
        required: true,
    },

    addressNumber: {
        type: String,
        required: true,
    },

    addressCity: {
        type: String,
        required: true,
    },

    addressCep: {
        type: String,
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

const Restaurant = mongoose.model('Restaurant', RestaurantSchema)

module.exports = Restaurant