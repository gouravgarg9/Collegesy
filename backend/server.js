require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
process.on('uncaughtException',(err)=>{
    console.log(err);
    process.exit(1);
})

const app = require('./app');
const Chat = require('./models/chatSchema');

//const DB = process.env.DB_CONN_STR;
const Initial_DB = process.env.MONGODB_ATLAS_LINK;
const Inter_DB = Initial_DB.replace('<username>',process.env.MONGODB_ATLAS_USERNAME);
const DB = Inter_DB.replace('<password>',process.env.MONGODB_ATLAS_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology : true
})
.then(() => console.log('DB connection successfull!'));

const port = process.env.PORT;
const server = app.listen(port,() => console.log("Server running on port :",port));
const io = require('socket.io')(server,{
    pingTimeout : 60000,
    cors : {
        origin : `http://localhost:3000`
    }
})

const socketToChatIdMap = {};
io.on('connection',(socket)=>{
    console.log('a new socket joined');
    //need userId to be passed
    socket.on('joinAllChats',async(userId)=>{
        (await Chat.find({buyerId : userId})).forEach((chat)=>{
            socket.join(chat._id);
            socketToChatIdMap[socket.id] = {chatId : chat._id,role : 'buyer'};
        })

        (await Chat.find({sellerId : userId})).forEach((chat)=>{
            socket.join(chat._id);
            socketToChatIdMap[socket.id] = {chatId : chat._id,role : 'seller'};
        })

    });

    //while emitting joinChat,client needs to send object containing 
    //chatId and current user role i.e. - 'buyer'/'seller'
    socket.on('joinChat',(data)=>{
        const {chatId,role} = data;
        socket.join({chatId});
        socketToChatIdMap[socket.id] = {chatId,role};
    })
    

    //to send a message client will emit message event
    
    //as soon as client enters the site he emit a recieve event
    //also client will listen to message event to recieve a message
    //and in callback will emit a recieve event to inform server
    socket.on('message',(message)=>{
        const chatId = socketToChatIdMap[socket.id].chatId;
        // io.to(chatId).broadcast.to('message',message);
        socket.broadcast.to(chatId).emit('message',message);
    });

    //client will listen to recieve event to mark its sent messages delivered
    socket.on('recieve',()=>{
        const {chatId,role} = socketToChatIdMap[socket.id];
        const roleStandardized = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
        const field = {};
        field[`lastRecieveBy${roleStandardized}`] = Date.now();
        Chat.findByIdAndUpdate(chatId,field);
        io.to(chatId).broadcast('recieve');
        
    });

    //client as soon as open chat will emit read event 
    //to mark blue tick he will listen to read events
    socket.on('read',()=>{
        const {chatId,role} = socketToChatIdMap[socket.id];
        const roleStandardized = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
        const field = {};
        field[`lastSeenBy${roleStandardized}`] = Date.now();
        Chat.findByIdAndUpdate(chatId,field);
        io.to(chatId).broadcast('read');
    })

    socket.on('disconnect',()=>{
        delete socketToChatIdMap[socket.id];
    })
})

io.on('message',(chatId,content)=>{
    io.to()
})


process.on('unhandledRejection',(err)=>{
    console.log(err);
    server.close(()=>process.exit(1));
})