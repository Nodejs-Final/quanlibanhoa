const mongoose = require('mongoose')
const schema = mongoose.Schema

const billSchema = new schema({
    idkh:{
        type:schema.Types.ObjectId,
        ref:'customers'
    },
    fullName:String,
    address:String,
    phoneNumber:String,
    email:String,
    dsmh:[
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'hoa',
              },
              name: String,       
              price: String,
              soluong: Number,
        }
    ],
    total: Number
},{timestamps: true})

module.exports = mongoose.model('bills',billSchema)