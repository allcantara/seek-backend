const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 40,
    },

    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },

    password: {
        type: String,
        require: true,
        required: false,
        minlength: 8,
        maxlength: 30,
    },

    name: {
        type: String,
        required: true,
        uppercase: true,
        minlength: 2,
        maxlength: 60,
    },

    surname: {
        type: String,
        required: true,
        uppercase: true,
        minlength: 3,
        maxlength: 60,
    },

    typeUser: {
        type: String,
        required: true,
    },

    clientSecret: {
        type: String,
        unique: true,
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

const User = mongoose.model('User', UserSchema)

module.exports = User