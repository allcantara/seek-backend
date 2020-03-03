// @ts-nocheck
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const host = require('../../constants/ip')

const UserSchema = new mongoose.Schema({

  image: {
    type: String,
    required: true,
  },

  restaurant: {
    type: mongoose.Types.ObjectId,
    ref: 'Restaurant',
    required: false,
  },

  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 40
  },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },

  password: {
    type: String,
    require: true,
    required: false,
    select: false,
    minlength: 8,
    maxlength: 30
  },

  name: {
    type: String,
    required: true,
    uppercase: true,
    minlength: 2,
    maxlength: 60
  },

  surname: {
    type: String,
    required: true,
    uppercase: true,
    minlength: 3,
    maxlength: 60
  },

  typeUser: {
    type: String,
    required: true,
    select: false
  },

  passwordResetToken: {
    type: String,
    unique: false,
  },

  passwordResetExpires: {
    type: Date,
  },

  firstAccess: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
}, { toJSON: { virtuals: true }});

UserSchema.pre("save", async function(next) {
  const hash = await bcrypt.hash(String(this.password), 10);
  this.password = hash;
  next();
});

UserSchema.virtual('image_url').get(function() {
  return `http://${host.IP}:3333/files/${this.image}`
})

const User = mongoose.model("User", UserSchema);

module.exports = User;
