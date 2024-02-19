const mongoose = require('mongoose')
const validator = require('validator')
const userRoles = require("../utils/roles")
const usersModal = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique:true,
        required: true,
        validate:[validator.isEmail,'email must be a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        enum:[userRoles.ADMIN,userRoles.MANGER,userRoles.USER],
        default:userRoles.USER
    },
    avatar:{
        type:String,
        default:'upload/avatar.png'
    }
})
module.exports = mongoose.model('User',usersModal)