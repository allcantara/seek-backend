const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },

  name: {
    type: String,
    required: true,
    uppercase: true
  },

  ingredients: [
    {
      type: String,
      required: true,
      uppercase: true
    }
  ],

  price: {
    type: Number,
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

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
