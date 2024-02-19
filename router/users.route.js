const express = require('express')
const userController = require("../controllers/users.controller")
const router = express.Router()
const multer = require('multer')
const diskStorage = multer.diskStorage({
    destination:function(req,file,cb){
        console.log(file);
        cb(null,'uploads')
    },
    filename:function(req,file,cb){
        //to get extension 
        const ext = file.mimetype.split('/')[1]
        // to create page with random name and extension
        const fileName = `user-${Date.now()}.${ext}`
        cb(null,fileName)
    }
})
//here i make check if this file is image or pdf or another type
const filterFile = (req,file,cb)=>{
    const imageType = file.mimetype.split('/')[0]
    if(imageType === 'image'){
        return cb(null,true)
    }else{
        cb(false)
    }
}
const upload = multer({
    storage: diskStorage,
    fileFilter:filterFile
})
const verifyToken = require("../middleware/verifyToken")
router.route('/').get(verifyToken, userController.getAllUsers)
router.route('/register').post(upload.single('avatar'), userController.register)
router.route('/login').post(userController.login)


module.exports = router;