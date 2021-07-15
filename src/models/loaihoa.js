const mongoose = require('mongoose')
const schema = mongoose.Schema

const loaihoa = new schema({
    maloai: String,
    tenloai: String,
},{
    timestamp:true
})

module.exports = mongoose.model('categoryflowers',loaihoa)
