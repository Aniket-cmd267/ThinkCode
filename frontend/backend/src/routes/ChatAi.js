const express= require('express')
const chatAiRouter= express.Router();
const chatbot= require('../controllers/solveDoubt')
const userMiddleware= require('../middleware/userMiddleware')
chatAiRouter.post('/chat',userMiddleware,chatbot);
module.exports= chatAiRouter;