// @ts-nocheck
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
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
    unique: true,
    select: false
  },

  passwordResetExpires: {
    type: Date,
    select: false
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

UserSchema.pre("save", async function(next) {
  const hash = await bcrypt.hash(String(this.password), 10);
  this.password = hash;
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
