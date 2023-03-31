//user management (source: [3])

//import packages and routing
const express = require('express')
const router = express.Router()

const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validations/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

//POST - create users / registration
router.post('/register', async (req, res) => {
    //validation 1 on user input - requirements using joi package
    const { error } = registerValidation(req.body)
    if (error) {
        res.status(400).send({ message: error['details'][0]['message'] })
    }else{
        //validation 2 on user input - user exists
        const userExists = await User.findOne({ user_email: req.body.user_email })
        if (userExists) {
            return res.status(400).send({ message: 'User already exists.' })
        }else{
            //password encryption through hashed representation using bcryptjs package
            const salt = await bcryptjs.genSalt(5)
            const hashedPassword = await bcryptjs.hash(req.body.user_password, salt)
        
            //insert user
            const userData = new User({
                user_name: req.body.user_name,
                user_email: req.body.user_email,
                user_password: hashedPassword
            })
            try {
                const saveUser = await userData.save()
                res.send(saveUser)
            } catch (err) {
                res.status(400).send({ message: err })
            }
        }
    }
})

//POST - login users
router.post('/login', async (req, res) => {
    //validation 1 on user input - requirements using joi package
    const { error } = loginValidation(req.body)
    if (error) {
        res.status(400).send({ message: error['details'][0]['message'] })
    }else{
        //validation 2 on user input - user exists
        const user = await User.findOne({ user_email: req.body.user_email })
        if (!user) {
            return res.status(400).send({ message: 'User does not exist.' })
        }else{
            //validation 3 on user input - password
            const passwordValidation = await bcryptjs.compare(req.body.user_password, user.user_password)
            if (!passwordValidation) {
                return res.status(400).send({ message: 'Password does not match.' })
            }
        
            //generate an auth-token and send token
            const token = jsonwebtoken.sign({ _id: user._id }, process.env.TOKEN_SECRET)
            res.header('auth-token', token).send({ 'auth-token': token})
        }
    }
})

module.exports = router