//(source: [3])

//validations for authentication using joi package
const joi = require('joi')

//validation for creation of users
const registerValidation = (data) => {
    const schemaValidation = joi.object({
        user_name:joi.string().required().min(3).max(256),
        user_email:joi.string().required().min(6).max(256).email(),
        user_password:joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

//validation for user login
const loginValidation = (data) => {
    const schemaValidation = joi.object({
        user_email:joi.string().required().min(6).max(256).email(),
        user_password:joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation