const mongoose = require('mongoose');
const Submission = require('./submission');
const Schema = mongoose.Schema;

const codeChatSchema = new Schema({
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
    chatHistory: [{
        role: {
            type: String,
            enum: ['user', 'model'],
        },
        message: {
            type: String,
        },
        timestamp: { type: Date, default: Date.now }
    }],
    userCode: {
        language: {
            type: String,
            enum: ['c++', 'javascript', 'java'],
        },
        code: {
            type: String
        }
    }
},
{ timestamps: true }
)

codeChatSchema.index({ userId: 1, problemId: 1 }, {unique: true})
const codeChat = mongoose.model('codeChat', codeChatSchema);
module.exports = codeChat
