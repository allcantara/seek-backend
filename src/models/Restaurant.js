const mongoose = require('mongoose')

const RestaurantSchema = new mongoose.Schema({

    userId: {
        type: Number,
        required: true,
    },

    name: {
        type: String,
        required: true,
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