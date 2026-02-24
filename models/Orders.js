const mongoose = require('mongoose')
const autoSequence = require('./Sequence')

const orderSchema = new mongoose.Schema({

  ref: {
    type: String,
    unique: true
  },

  client: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String }
  },

  date: {
    type: Date,
    default: Date.now
  },

  total_price: {
    type: Number,
    required: true,
    min: 0
  },

  shops: [
    {
      shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
      },

      services: [
        {
          service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
          },

          quantity: {
            type: Number,
            required: true,
            min: 1
          },

          unit_price: {
            type: Number,
            required: true,
            min: 0
          },

          subtotal: {
            type: Number,
            required: true,
            min: 0
          }
        }
      ]
    }
  ]

}, { timestamps: true })

autoSequence(orderSchema, 'ref', 'ORD-', 'orderSeq')
orderSchema.pre('save', async function (next) {

  if (!this.ref) {

    const counter = await Sequence.findOneAndUpdate(
      { name: 'orderSeq' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )

    const number = counter.seq
    this.ref = 'C00' + number

  }
  next()
})

module.exports = mongoose.model('Order', orderSchema)