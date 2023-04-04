const express = require("express")
const router = express.Router()
const Usermodel = require("../Models/UserModel")
const PostModel = require("../Models/postModel")

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const jwtsecretkey = "sgnj354748#$%^&*eneekem"


//log in api implimentation
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: "email and password mandatory" })
    }
    let user = await Usermodel.find({ email: email })
    console.log(user)

    if (!user) {  // if user not found
        return res.status(400).json({ error: "user does not exist" })

    }

    //if user already exist  then compare the password 
    bcrypt.compare(password, user[0].password, function (err, result) {   // user.password-->hashpassword in the db
        if (err) {
            console.log(err.message)
            return res.status(500).json({
                status: "failed",
                message: err.message
            })
        }
        if (result) {
            //create token after login
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: user[0]._id
            }, jwtsecretkey);

            return res.json({
                status: "success",
                message: "Login success",
                token
            })
        }
        else {
            return res.json({
                status: "failed",
                message: "Invalid Credentials"
            })
        }
    });
})

// register api implementation
router.post("/register", async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body  //object destructuring
    if ( !email || !password) {
        return res.status(400).json({ error: "one or more mandatory field is empty" })
    }

    //avoid duplicate users
    let Userexist = await Usermodel.findOne({ email: email })
    if (Userexist) {
        return res.status(500).json({ error: "User with this email already exist" })
    }

    // hashing the password and store the userdata in the DB.
    bcrypt.hash(password, 10, async (err, hashpassword) => {
        if (err) {
            return res.json({
                status: "failed",
                error: err.message``
            })

        }
        const user = await Usermodel.create({ email, password: hashpassword })
        console.log(password)
        user.save()  
            .then(() => {
                return res.status(201).json({ status: "User Registered successfully" })

            })
            .catch((err) => {
                console.log(err)
            })
    });

})

router.post("/addpost", async(req,res)=>{

    const {label, image} = req.body
    try{
        const newnotes = await PostModel.create({
            label:label,
            image:image,
            author:req.user

        }
         

            
        )
        return res.status(201).json(newnotes)
    }
    catch(err){
        res.status(500).json({
            error:err
        })
    }



})

router.get("/myposts", async(req,res)=>{
   
     try{
         const posts = await PostModel.find({author:req.user})
       
         if(posts){
             return res.json({posts:posts})
         }
         return res.json({ message:"no posts available"})
     }
     catch(err){
         res.json({
             error:err.message
         })
 
     }
 })

router.delete("/deletepost/:label", async(req,res)=>{
    const {label}= req.params
    try{
        console.log("my label"+label)
        const deletepost = await PostModel.deleteOne({label:label})
        console.log(deletepost)
       
       
        res.status(204).json({
            status:null
      
      })
    }
    catch(err){
        res.status(500).json({
            error:err
        })
    }
})

module.exports = router