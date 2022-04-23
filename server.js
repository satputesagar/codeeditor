
const express =require('express');
const app=express();
const {Server} =require('socket.io')
const http =require('http');
const path=require('path');
const ACTIONS = require('./src/Actions');


const server =http.createServer(app);

const io=new Server(server);
// live dev mode 
app.use(express.static('build'));
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'build',index.html));
});
// store database
const userSocketMap ={};


function getALLConnectedClients (roomId){
    // map
    Array.from(io.sockets.adapter.rooms.get(roomId)||[]).map((socketId)=>{
        return {
            socketId,
            username:userSocketMap[socketId],
        };
    });
}

io.on('connection',(socket)=>{
    console.log("socket connected",socket.id);

socket.on(ACTIONS.JOIN,({roomId,username})=>{
    userSocketMap[socket.id]=username;
    socket.join(roomId);
    const clients =getALLConnectedClients(roomId);
    clients.forEach(({socketId})=>{
    io.to(socketId).emit(ACTIONS.JOINED,{
    clients,
    username,
    socketId : socket.id,
        });
    });
 // console.log(socketId);
});

socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
    // console.log("reciving code");
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{
        code
    });
})
socket.on(ACTIONS.CODE_CHANGE,({socketId,code})=>{
    // console.log("reciving code");
    io.to(roomId).emit(ACTIONS.CODE_CHANGE,{
        code
    });
})


socket.on('disconnecting',()=>{
    const rooms =[...socket.rooms];
    rooms.forEach((roomId)=>{
        socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
            socketId:socket.id,
            username:userSocketMap[socket.id],
        });
    });

    delete userSocketMap[socket.id];
    socket.leave();
});

});


const PORT=process.env.PORT ||5000;
server.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
})