const express= require('express')
const chatAiRouter= express.Router();
const {chatbot, getChatHistory}= require('../controllers/solveDoubt')
const userMiddleware= require('../middleware/userMiddleware')
chatAiRouter.post('/chat',userMiddleware,chatbot);
chatAiRouter.post('/get/chat/:id',userMiddleware, getChatHistory)
module.exports= chatAiRouter;   