const mongoose = require('mongoose')

const PurchaseSchema = new mongoose.Schema({

    restaurantId: {
        type: Number,
        required: true,
    },

    userId: Number, // Para compras pelo app

    device: {
        type: String,
        required: true, // Tipo de dispositivo >>> APP ou WEB
    },

    products: {
        type: [],
        required: true,
    },

    priceTotal: {
        type: Number,
        required: true,
    },

    payment: {
        type: String,
        required: true,
    },

    dateTime: {
        type: Date,
        default: new Date(),
    },

    tableNumber: Number, // Para compras no estabelecimanto

    clientName: String, // Para compras no estabelecimento

    status: {
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

const Purchase = mongoose.model('Purchase', PurchaseSchema)

module.exports = Purchase