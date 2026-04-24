const mongoose = require('mongoose');
const { Schema} = mongoose;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'found', 'not found'],
        default: 'pending'
    },
    storeName: {
        type: String,
        default: 'Xyz'
    }
});

const parchiSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'Shopping List'
    },
    items: [itemSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Parchi', parchiSchema);