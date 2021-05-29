const mongoose = require('mongoose')
const schema = mongoose.Schema

const Flower = new schema({
    id: mongoose.ObjectId,
    name: { type: String, maxLength: 255 },
    price: { type: String, maxLength: 255 },
    category: { type: String, maxLength: 255 },
    description: { type: String, maxLength: 600 },
    image: { type: String, maxLength: 255 },
},{
    timestamp:true
})

module.exports = mongoose.model('Flower',Flower)