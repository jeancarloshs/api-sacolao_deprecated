const express = require('express')
// const morgan = require('morgan')
// const cors = require('cors')
// const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
app.use(express.raw({limit: '200MB'}))


const port = process.env.PORT || 3030
const ip = require('ip').address()
const protocol = process.env.PROTOCOL

const routes = require('./routes/routes')
app.use(routes)

app.listen(port,()=>{
    console.log(`Server started in http://localhost:${port} or ${protocol}://${ip}:${port}`)
})
