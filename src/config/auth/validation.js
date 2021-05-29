const Joi = require('@hapi/joi');

// Register Validate
const registerValidation = function(data){
    const schema = Joi.object ({
        name: Joi.string()
                 .min(6)
                 .required(),
        email: Joi.string()
                   .email()
                   .min(6)
                   .required(),
        password: Joi.string()
                   .min(6)
                   .required(),
        fullName: Joi.string()
                   .required(),
        address: Joi.string()
                    .required(),
        phoneNumber: Joi.number()
                    .min(10)
                    .required()

        
                          
    })
   return  schema.validate(data)
}
module.exports.registerValidation = registerValidation

// Login Validate
const loginValidation = function(data){
    const schema = Joi.object ({
        name: Joi.string()
                   .min(6)
                   .required(),
        password: Joi.string()
                   .min(6)
                   .required(),
    })
   return  schema.validate(data)
}
module.exports.loginValidation = loginValidation