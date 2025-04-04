const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

const authCheck = async (req, res, next) => {
    try {
        // GET AUTH HEADER
        const { authorization } = req.headers

        //  SPLIT TOKEN FROM 'Bearer'
        const token = authorization.split(' ')[1]

        // Verify token and decode
        if (token) {
            jwt.verify(token, process.env.SECRET)
            next()
        } else {
            return res.status(401).json({ message: 'Request is not authorized' })
        }
        
    } catch (error) {
        return res.status(401).json({ message: 'Request is not authorized' })
    }
}

module.exports = authCheck