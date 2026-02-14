const moogose = require('mongoose')

const shopShema = new moogose.Schema(
    {
        name:
        {
            type: String,
            required: true
        },
        type:
        {
            type: String,
            required: true
        },
        description:
        {
            type: String,
            required: true
        },
        email:
        {
            type: String,
            required: true,
            unique: true,
            match:[
                /^\S+@\S+\.\S+$/,
                'Format invalid of the email address'
            ]
        },
        password:
        {
            type: String,
            required: true
        },
        role: {
                type: String,
                default: "SHOP",
                requiredd: true
            }

    }
);

module.exports = moogose.model('Shop', shopShema); 