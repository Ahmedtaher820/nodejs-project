// to access .env enviroment
require('dotenv').config()
const express = require('express')
const path = require('path')
const httpStatusText = require('./utils/httpStatus')
const app = express() 
// here i need to get avatar as static img 
app.use('/api/uploads',express.static(path.join(__dirname,'uploads')))
var cors = require('cors')
//to deny cors error
app.use(cors())

// i make the url in env file to make my url more secret
const url = process.env.MONGO_URL
app.use(express.json())
 const mongoose = require('mongoose')
 mongoose.connect(url).then(()=>{
    console.log('mongodb server');
 })
const {body,validationResult} = require('express-validator')
//to make express handl body that send from front-end side to json
//it's json.parser() we used it for same porpuse 
const productsRouter = require('./router/products.route')
const userRouter = require('./router/users.route')
app.use('/api/products', productsRouter)
app.use('/api/users', userRouter)

//app.all(*,(req,res)=>{}) ==> this for handle all request that not exist in our app
app.all('*',(req,res)=>{
    return res.status({
        status: httpStatusText.ERROR,
        message:'this request is not avaliable'
    })
})

app.listen(4000,()=>{
    console.log('server is listning')
})