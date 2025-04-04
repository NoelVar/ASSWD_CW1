// NOTE: IMPORTS ----------------------------------------------------------------------------------
const userModel = require('../models/userModel')
const { v4: uuid4 } = require('uuid')

// NOTE: GENERATE API KEY -------------------------------------------------------------------------
const genApiKey = async (req, res) => {
    const id = req.body
    // CHECK IF EMAIL IS EMPTY
    if (!id) {
        return res.status(400).json({ message: "No user id provided." })
    }

    // SEPERATING ID FROM JSON { id: xxxxxxxx} to {xxxxxxxx}
    const uID = id.id
    
    try {
        // CHECKING IF USER EXISTS
        const user = await userModel.findById({ _id: uID })
        if (!user) {
            return res.status(404).json({ message: "Cannot find user." })
        }

        // GENERATING KEY
        const key = uuid4()

        // Check if key already exists
        const keyExists = await userModel.findOne({ "apikeys.key": key })
        if (keyExists) {
            // If key exists, generate a new one
            return genApiKey(req, res)
        }

        // ADDING DEFAULT STATUS
        const status = 'not-active'

        // STORING KEY AND STATUS IN APIKEY
        const apiKey = [{
            key: key,
            status: status
        }]

        // CHECKING IF USER REACHED THEIR API GENERATION LIMIT
        if (user.apikeys.length >= 10) {
            return res.status(400).json({ message: "API key generation limit has been reached."})
        }

        // SAVING KEY INTO USER'S TABLE
        const saveKey = await userModel.findOneAndUpdate( { _id: uID },
            { $addToSet: { apikeys: apiKey } },
            { new: true }
        )

        if (!saveKey) {
            return res.status(400).json({ message: "API key Could not be generated."})
        }

        // RETURNING KEY IN RESPONSE
        return res.status(201).json({message: "API key generated successfully!", key: apiKey})

    } catch(err) {
        res.status(500).json({ message: "Something went wrong."  + err})
    }
}

// NOTE: GET ALL KEYS -----------------------------------------------------------------------------
const getApiKeys = async (req, res) => {
    const email = req.body

    // CHECK IF EMAIL IS EMPTY
    if (!email) {
        return res.status(400).json({ message: "No email address provided." })
    }

    // SEPERATING EMAIL FROM JSON { email: xxxx@xxx.xxxx}
    const uEmail = email.email
    
    try {
        // CHECKING IF USER EXISTS
        const user = await userModel.findOne({ email: uEmail })
        if (!user) {
            return res.status(404).json({ message: "Cannot find user." })
        }

        res.status(200).json(user.apikeys)
    } catch (err) {
        // RETURNING ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ message: "Something went wrong." })
    }
}

// ACTIVATE API KEY -------------------------------------------------------------------------------
const activateApiKey = async (req, res) => {
    const { id } = req.body
    const { email } = req.body

    // CHECK IF EMAIL IS EMPTY
    if (!email) {
        return res.status(400).json({ message: "No email address provided." })
    }
    
    try {
        // CHECKING IF USER EXISTS
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "Cannot find user." })
        }

        // RETRIEVING SELECTED API KEY FROM ALL API KEYS
        var apikey = null
        
        for (var i = 0; i < user.apikeys.length; i++) {
            if (user.apikeys[i]._id.toString() == id) {
                apikey = user.apikeys[i]
            }
        }
        // CHECKING IF API KEY EXISTS
        if (!apikey) {
            return res.status(404).json({ message: "Cannot find api key." })
        }

        // DEACTIVATING ALL API KEYS
        await userModel.updateOne(
            {
                email 
            },
            {
                $set: { "apikeys.$[].status": "not-active" } 
            }
        )

        // ACTIVATING SELECTED API KEY
        const updateKey = await userModel.findOneAndUpdate( 
            { 
                email: email,
                'apikeys._id': id
            },
            // ADD 'apikeys' ID TO ONLY CHANGE ONE
            { 
                $set: {"apikeys.$.status": "active"}
            },
            {
                new: true
            }
        )

        if (!updateKey) {
            return res.status(400).json({ message: 'Couldn\'t activate api key' })
        }

        res.status(200).json(updateKey)
    } catch (err) {
        // RETURNING ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ message: "Something went wrong." + err})
    }
}

const deactivateAllKeys = async (req, res) => {
    const { email } = req.body

    // CHECK IF EMAIL IS EMPTY
    if (!email) {
        return res.status(400).json({ message: "No email address provided." })
    }
    
    try {
        // CHECKING IF USER EXISTS
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "Cannot find user." })
        }

        // DEACTIVATING ALL API KEYS
        const deactivate = await userModel.updateOne(
            {
                email 
            },
            {
                $set: { "apikeys.$[].status": "not-active" } 
            }
        )

        if (!deactivate) {
            return res.status(404).json({ message: "Couldn't deactivate keys." })
        }

        res.status(200).json({ message: "All keys have been deactivated!"})
    } catch (err) {
        // RETURNING ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ message: "Something went wrong." + err})
    }
}

// DELETING API KEY -------------------------------------------------------------------------------
const deleteAPIkey = async (req, res) => {
    const { id } = req.body
    const { email } = req.body

    // CHECK IF EMAIL IS EMPTY
    if (!email) {
        return res.status(400).json({ message: "No email address provided." })
    }
    
    try {
        // CHECKING IF USER EXISTS
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "Cannot find user." })
        }

        // RETRIEVING SELECTED API KEY FROM ALL API KEYS
        var apikey = null
        for (var i = 0; i < user.apikeys.length; i++) {
            if (user.apikeys[i]._id.toString() == id) {
                apikey = user.apikeys[i]
            }
        }
        // CHECKING IF API KEY EXISTS
        if (!apikey) {
            return res.status(404).json({ message: "Cannot find api key." })
        }

        // REMOVING API KEY
        const removeKey = await userModel.updateOne(
            {
                email
            },
            {
                $pull: { "apikeys": {$in: [apikey]} }
            }
        )

        if (!removeKey) {
            return res.status(404).json({ message: "Couldn't remove key." })
        }

        res.status(200).json({ message: "Key removed successfully!"})
    } catch (err) {
        // RETURNING ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ message: "Something went wrong." + err})
    }
}

// DELETING API KEY -------------------------------------------------------------------------------
const getAllAPIkeys = async (req, res) => {
     try {
            // FETHCING ALL USERS
            const users = await userModel.find({})
    
            // CHECKING IF THE USERS HAVE BEEN FOUND
            if (!users) {
                return res.status(404).json({ message: "Cannot get users." })
            }

            var userInfo = users.map((user) => {
                return {
                    username: user.username,
                    email: user.email,
                    apikeys: user.apikeys
                }
            }) 

            if (!userInfo) {
                return res.status(400).json({ message: 'Could not get user and API key information.' })
            }
    
            // RETURNING USERS
            return res.status(200).json(userInfo)
    
        } catch (err) {
            // RETURNING ERROR IF SOMETHING WENT WRONG
            return res.status(500).json({ message: "Something went wrong." })
        }
}

module.exports = {
    genApiKey,
    getApiKeys,
    activateApiKey,
    deactivateAllKeys,
    deleteAPIkey,
    getAllAPIkeys
}
// END OF DOCUMENT --------------------------------------------------------------------------------