const userModal = require('../models/users.model')
const httpStatusText = require("../utils/httpStatus")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const generateToken = require('../utils/generateToken')
require('dotenv').config()

const getAllUsers = async (req, res) => {
    const query = req.query
    const limit = query.limit || 10
    const page = query.page || 1
    const skip = (page - 1) * limit
    const users = await userModal.find({}, {
        __v: false,
        password: false
    }).limit(limit).skip(skip)
    res.json({
        status: httpStatusText.SUCCESS,
        data: {
            users
        },
        limit: limit,
        page: page,
        skip: skip
    })

}
const register = async (req, res) => {
    const {
        firstname,
        lastname,
        email,
        password,
        role
    } = req.body
    //mke check if user is already exist or no by findOne with ({email})
    const isOldUser = await userModal.findOne({
        email: email
    })

    if (isOldUser) {
        return res.status(404).json({
            status: httpStatusText.FAIL,
            message: 'user email is alreday exist'
        })
    }
    // to crypt password to increase secure hash(PASSWORD,salt) ==> salt is the number of digit 
    const hashPass = await bcrypt.hash(password, 10)
    const newUser = new userModal({
        firstname,
        lastname,
        email,
        role,
        password: hashPass,
        avatar: req.file.filename
    })
    //to create token with jwt ==> jwt.sign(payload,key)
    //to genertae good key use node keyword in terminal and write require('crypto').randomBytes(32).toString('hex')
    const token = await generateToken({
        email: newUser.email,
        id: newUser._id,
        role:newUser.role
    })
    newUser.token = token
    await newUser.save()
    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: {
            user: newUser
        }
    })

}
const login = async (req, res) => {
    const {
        email,
        password
    } = req.body
    if (!email && !password) {
        res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'email and password are required'
        })

    }
    const isUser = await userModal.findOne({
        email: email
    })
    if (!isUser) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'user is not found'
        })

    }
    //to convert crypt pass to norml pass 
    // i have to use compare(password is coming from body , pssword in DB)
    const convertPass = await bcrypt.compare(password, isUser.password)
    if (isUser && convertPass) {
        //generate token with jwt
        const token = await generateToken({
            email: isUser.email,
            id: isUser._id,
            role: isUser.role
        })
        return res.status(200).json({
            status: httpStatusText.SUCCESS,
            message: 'user login successfuly',
            token: token
        })
    } else if (!convertPass) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'password is not correct'
        })
    }
}
module.exports = {
    getAllUsers,
    register,
    login
}