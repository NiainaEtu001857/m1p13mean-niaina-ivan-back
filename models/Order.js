const mongoose = require('mongoose')
const autoSequence = require('./Sequence')

const orderDetailSchema =  new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    }
})

const orderSchema = new mongoose.Schema({
    ref: {
        type: String,
        unique: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    shops: [
        {
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shop',
            required: true
        },
        items: [orderDetailSchema]
        }
    ],

    totalAmount:{
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'delivered'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


orderSchema.index({ client: 1, createdAt: -1})
orderSchema.index({ shop: 1, createdAt: -1})
autoSequence(orderSchema, 'ref', 'CMD-', 'orderSeq');

module.exports = mongoose.model('Order', orderSchema)
