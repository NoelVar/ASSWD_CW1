// NOTE: IMPORTS ----------------------------------------------------------------------------------
const express = require('express')
const { 
    getAllUsers,
    getSingleUser
} = require('../controllers/userController')

// NOTE: CREATING ROUTER
const router = express.Router()

// NOTE: GET ALL USERS ROUTE
router.get('/all-users', getAllUsers)
router.post('/single-user', getSingleUser)


module.exports = router
// END OF DOCUMENT --------------------------------------------------------------------------------