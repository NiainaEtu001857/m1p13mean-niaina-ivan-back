const mongoose = require('mongoose')

const sequenceSchema = new mongoose.Schema 
({
    _id: String,
    seq: { type: Number, default: 1000}

});

const Sequence =  mongoose.model('Sequence', sequenceSchema);


function autoSequence(schema, name, prefix, counterId)
{
    schema.pre('save', async function (){
        if (this.isNew)
        {
            const counter = await Sequence.findByIdAndUpdate(
                counterId,
                { $inc: { seq: 1}},
                { new: true, upsert: true}
            );
            const formattedSeq = String(counter.seq).padStart(4, '0');
            this[name] = `${prefix}${formattedSeq}`;

        }
    });
}

module.exports = autoSequence;