require('dotenv').config();
const express = require('express')
const app = express();
const http = require("http");
const main =  require('./config/db')
const cookieParser =  require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit")
const cors= require('cors')
const chatAiRouter= require('./routes/ChatAi')
const contestRouter = require("./routes/contest");
const { Server } = require("socket.io");
const { registerContestSocket } = require("./sockets/contestSocket");
const interviewRoutes= require('./routes/interviewRoutes')
const videoRoutes = require('./routes/video')

const profileUploadRoute=  require("./routes/profile")

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json());

app.use(cookieParser());
app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',chatAiRouter)
app.use('/contest',contestRouter)
app.use('/interview',interviewRoutes)
app.use('/profile',profileUploadRoute);
app.use('/video', videoRoutes);

registerContestSocket(io);
const InitalizeConnection = async ()=>{
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected");    
        
        server.listen(process.env.PORT, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })
    }
    catch(err){
        console.log("Error: "+err);
        process.exit(1);
    }
}
InitalizeConnection();
