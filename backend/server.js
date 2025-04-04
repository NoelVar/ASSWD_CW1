// NOTE: IMPORTS ----------------------------------------------------------------------------------
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const apiKeyRoute = require('./routes/apiKeyRoute')
const session = require('express-session')
const cors = require('cors')

const app = express()

app.use(express.json())

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use((req, res, next) => {
    // DEBUG: REMOVE BEFORE DEPLOYMENT
    console.log("Request path: " + req.path, " Request method: " + req.method)
    next()
})

// NOTE: ROUTES
app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/api', apiKeyRoute)

// NOTE: DB CONNECTION
mongoose.connect(process.env.DB_CONNECTION)
    .then(() => {
        // NOTE: LISTENING FOR REQUESTS
        app.listen(7000, () => {
            console.log('Listening on port 7000')
        })
    })
    .catch((error) => {
        console.error({message: "ERROR during database connection. " + error})
    })

// END OF DOCUMENT --------------------------------------------------------------------------------