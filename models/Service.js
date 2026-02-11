const mongoose = require('mongoose')
const autoSequence = require('./Sequence')

const serviceShema = new mongoose.Schema({
     shop: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Shop', 
          require: true
     },
     name:{
     type: String,
     require: true
     }, 
       ref:{
          type: String,
          unique: true
       },
       /*price_u:
       {
            type: Number,
            require: true,
            min: 0
       },*/
       brand:
       {
            type: String,
            require: true
       }, 
       type:
       {
            type: String,
            require: true
       }, 
       min_quantity:
       {    
         type: Number,
         require: true,
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