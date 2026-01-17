const mongoose = require('mongoose');
const Submission = require('./submission');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true,
    },
    title: {
        type: String
    },
    chatHistory: [{
        role: {
            type: String,
            enum: ['user', 'model'],
        },
        parts: [{
            text:{
                type:'String'
            }
        }],
        timestamp: { type: Date, default: Date.now }
    }]
},
{ timestamps: true }
)

chatSchema.index({ userId: 1, problemId: 1 }, {unique: true})
const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
