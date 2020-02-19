const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  device: {
    type: String,
    required: true, // Tipo de dispositivo >>> APP ou WEB
    uppercase: true
  },

  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemPurchase",
      required: true,
      unique: false
    }
  ],

  priceTotal: {
    type: Number,
    required: true
  },

  payment: {
    type: String,
    required: true,
    uppercase: true
  },

  dateTime: {
    type: Date,
    default: new Date()
  },

  code: {
    type: String,
    required: true,
    unique: true
  },

  delay: Date,

  tableNumber: Number, // Para compras no estabelecimanto

  clientName: String, // Para compras no estabelecimento

  status: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

const Purchase = mongoose.model("Purchase", PurchaseSchema);

module.exports = Purchase;
