const express = require('express')
// const morgan = require('morgan')
// const cors = require('cors')
// const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()

// app.use(morgan('dev'))
// app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json({limit: '200mb'}))
// app.use(cors())


const port = process.env.PORT || 3030
const ip = require('ip').address()
const protocol = process.env.PROTOCOL

const routes = require('./routes')
app.use(routes)

app.listen(port,()=>{
    console.log(`Server started in http://localhost:${port} or ${protocol}://${ip}:${port}`)
})
