const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema({
    service: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Service', 
        require: true
    },
    quantity:
    {
        type: Number,
        require: true,
        min: 0
    },
    sale_price: 
    {
        type: Number,
        require: true,
        min: 0
    },
    purchase_price:
    {
        type: Number,
        require: true,
        min: 0
    },
    date:
    {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Stock', stockSchema);