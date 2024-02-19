const {products} = require('../data/products')
const productModal = require('../models/product.model')
const httpStatusText = require("../utils/httpStatus")
//controller it's place for handle our requests

const getAllProducts = async(req,res)=>{
    // find({},{})
    //first params is projection
    //$gt to filter products it's price greater than 800
    //$gte to filter products it's price greater than or equal 800
    //find({price:800}) ==> return all product with price 800
    //second params 
    //find({},{price:false}) ==> here i need to hide price from request
    //pagination
    /*
    1 ===> limit
    2 ==> page 
    3 => skip = (page-1) * limit
    */
    const query = req.query
    const limit = query.limit || 10
    const page = query.page || 1
    const skip = (page - 1) * limit
    // const products = await productModal.find({price:{$gt:800}},{__v:false,price:false})
    const products = await productModal.find({},{__v:false}).limit(limit).skip(skip)
    // to get all name with ahmed whatever it's uppercase or lowercase
    // const products = await productModal.find({name:/ahmed/i})
    //res.send() => for send any data html,json what ever
    //res.json() ==> for send data as json
    res.json({
        status: httpStatusText.SUCCESS,
        data: {
            products
        },
        limit: limit,
        page:page,
        skip:skip
    })
}
const getProductByID = async(req,res)=>{
    //req.params.id ==> to get the id it's send from frontend side
    const productId = req.params.id
    //to handle error we have to use try catch
    try {
        const product = await productModal.findById(productId)
        //if i want to check this course it's avaliable or not
        // nd i can send status code with chain and send 404 if it's not found
        if(!product){
            return res.status(404).json({
                 status: httpStatusText.FAIL,
                     data: {
                         products: null
                     }
            })
        }
        return res.json({
            status: httpStatusText.SUCCESS,
            data:{product}
        })
        
    } catch (error) {
        return res.status(400).json({
            status: httpStatusText.ERROR,
            data: {
                products:"NOT Found Gourse With This ID"
            }
        })
    }
}
const createProduct = async(req,res)=>{
    const body = req.body
    const newProduct = new productModal(body)
    await newProduct.save()
    //for get errors i have to call validationResult function and pss req to it
    // const errors = validationResult(req)
    // console.log(errors)
    // if(!errors.isEmpty()){
    //     return res.status(400).json(errors.array())
    // }
    //201 for create json
    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: {
            newProduct
        }
    })
}
const updateProduct = async(req,res)=>{
    const body = req.body
    const id = req.params.id
    try {   
        //$set is operator
        //update one with two params id and operator for body ==> updateOne({_id:id},{$set:{...body}})
        const updateProduct = await productModal.updateOne({_id:id},{$set:{...body}})
        return res.status(200).json({status:'suuccess',data:{updateProduct}})
    } catch (err) {
        return res.status(400).json({ status:httpStatusText.ERROR,message:err.message})
    }
}
const deleteProduct = async(req,res)=>{
    const id = req.params.id
    try {
        const data = await productModal.deleteOne({_id:id})
        res.status(200).json({success:true , msg :data})
    } catch (error) {
        res.status(400).json({msg:error.message})
    }
}
module.exports = {
    getAllProducts,
getProductByID,
createProduct,
updateProduct,
deleteProduct
}