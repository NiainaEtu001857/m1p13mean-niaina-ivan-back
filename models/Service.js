const mongoose = require('mongoose')
const autoSequence = require('./Sequence')

const serviceShema = new mongoose.Schema({
     shop: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Shop', 
          required: true
     },
     name:{
     type: String,
     required: true
     }, 
       ref:{
          type: String,
          unique: true
       },
       /*price_u:
       {
            type: Number,
            required: true,
            min: 0
       },*/
       brand:
       {
            type: String,
            required: true
       }, 
       type:
       {
            type: String,
            required: true
       }, 
       min_quantity:
       {    
         type: Number,
         required: true,
         min: 0
       },
       base_unity:
       {
            type: String,
       }
    }    
);

autoSequence(serviceShema, 'ref', 'SR-', 'serviceSeq');

module.exports = mongoose.model('Service', serviceShema);