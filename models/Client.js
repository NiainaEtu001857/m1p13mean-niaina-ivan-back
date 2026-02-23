const moogose = require('mongoose')

const client = new moogose.Schema(
    {
        first_name:
        {
            type: String,
            required: true
        },
        last_name:
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
                default: "Client"
            }

    }
);

module.exports = moogose.model('Client', client); 