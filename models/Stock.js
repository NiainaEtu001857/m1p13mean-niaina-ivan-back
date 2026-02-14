const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema({
    service: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Service', 
        required: true
    },
    quantity:
    {
        type: Number,
        required: true,
        min: 0
    },
    sale_price: 
    {
        type: Number,
        required: true,
        min: 0
    },
    purchase_price:
    {
        type: Number,
        required: true,
        min: 0
    },
    date:
    {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Stock', stockSchema);