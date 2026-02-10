const mongoose = require('mongoose')

const serviceShema = new mongoose.Schema({
       name:{
            type: String,
            require: true
       }, 
       price_u:
       {
            type: number,
            require: true,
            min: 0
       },
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
       shop:
       {
            type: String,
            require: true
       }, 
       min_quantity:
       {    
         type: number,
         require: true,
         min: 0
       },
       base_unity:
       {
            type: String,
       }
    }    
);

module.exports = mongoose.model('Service', serviceShema);