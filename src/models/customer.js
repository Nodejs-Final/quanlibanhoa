const mongoose = require('mongoose')
const schema = mongoose.Schema

const Customer = new schema({
    name: { type: String, maxLength: 255 },
    password: { type: String, maxLength: 255 },
    fullName: { type: String, maxLength: 255 },
    address: { type: String, maxLength: 255},
    phoneNumber: { type: String, maxLength: 255 },
    email: { type: String, maxLength: 255 },
},{
    timestamp:true
})

module.exports = mongoose.model('Customer',Customer)