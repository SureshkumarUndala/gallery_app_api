const express = require('express')
const app = express()
const Authentication = require("./Routes/authentication")
const bodyParser = require("body-parser")
const routes = require("./Routes/routes")
const cors = require('cors')
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
const jwtsecretkey =  "sgnj354748#$%^&*eneekem"



const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))



app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())




mongoose.connect("mongodb+srv://usk3210:ZpVKiUkrLSGtR3Of@cluster0.four4ig.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("Db connected"))


app.use("/addpost", (req, res, next) => {

  if (req.headers.authorization) {
    const token = req.headers.authorization?.split("bearer ")[1]
    console.log(token)
    if (token) {
      //verify token
      jwt.verify(token, jwtsecretkey, function (err, decoded) {

        if (err) {
          return res.status(403).json({
            status: "failed",
            message: "Not a Valid token"
          })
        }
        req.user = decoded.data
        console.log(decoded)
        next()
      });

    } else {
      return res.status(401).json({
        status: "Failed",
        message: "Token is missing"

      })
    }
  } else {
    return res.status(403).json({
      status: "Failed",
      message: "Not authenticated user"

    })
  }


})




app.use("/myposts", (req, res, next) => {
  
  if (req.headers.authorization) {
    const token = req.headers.authorization?.split("bearer ")[1]
  
    if (token) {
      //verify token
      jwt.verify(token, jwtsecretkey, function (err, decoded) {

        if (err) {
          return res.status(403).json({
            status: "failed",
            message: "Not a Valid token"
          })
        }
        req.user = decoded.data
        console.log(decoded)
        next()
      });

    } else {
      return res.status(401).json({
        status: "Failed",
        message: "Token is missing"

      })
    }
  } else {
    return res.status(403).json({
      status: "Failed",
      message: "Not authenticated user"

    })
  }


})

app.use("/deletepost/:label", (req, res, next) => {
  console.log("hello")
  
  if (req.headers.authorization) {
    const token = req.headers.authorization?.split("bearer ")[1]
  
    if (token) {
      //verify token
      jwt.verify(token, jwtsecretkey, function (err, decoded) {

        if (err) {
          return res.status(403).json({
            status: "failed",
            message: "Not a Valid token"
          })
        }
        req.user = decoded.data
        console.log(decoded)
        next()
      });

    } else {
      return res.status(401).json({
        status: "Failed",
        message: "Token is missing"

      })
    }
  } else {
    return res.status(403).json({
      status: "Failed",
      message: "Not authenticated user"

    })
  }


})

app.use(Authentication)
app.use(routes)

app.use(express.json())

app.listen(8080, () => console.log("server started at 8080"))