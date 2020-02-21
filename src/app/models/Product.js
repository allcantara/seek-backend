const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({

  image: {
    type: String,
    required: true
  },

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
}, { toJSON: { virtuals: true } });

ProductSchema.virtual('image_url').get(function() {
  return `http://localhost:3333/files/${this.image}`
})

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
