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
// const videoRoutes = require('./routes/video')

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
// app.use('/video', videoRoutes);

registerContestSocket(io);
const InitalizeConnection = async () => {
    const PORT = process.env.PORT || 5000;
    try {
        console.log("⏳ Attempting MongoDB connection...");
        await main();
        console.log("🟢 MongoDB Connected Successfully");
    } catch (mongoErr) {
        console.error("🔴 MONGODB CRASHED THE BOOT:", mongoErr);
        process.exit(1);
    }
    try {
        console.log("⏳ Attempting Redis connection...");
        await redisClient.connect();
        console.log("🟢 Redis Connected Successfully");
    } catch (redisErr) {
        console.error("🔴 REDIS CRASHED THE BOOT:", redisErr);
        process.exit(1);
    }
    server.listen(PORT, () => {
        console.log(`🚀 Server live and listening on port: ${PORT}`);
    });
}
InitalizeConnection();
