const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({

  image: {
    type: String,
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],

  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },

  addressName: {
    type: String,
    required: true,
    uppercase: true
  },

  addressNumber: {
    type: String,
    required: true,
    uppercase: true
  },

  addressCity: {
    type: String,
    required: true,
    uppercase: true
  },

  addressCep: {
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
}, { toJSON: { virtuals: true } });

RestaurantSchema.virtual('image_url').get(function() {
  return `http://localhost:3333/files/${this.image}`
})

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

module.exports = Restaurant;
