const express = require('express');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io')
const cors = require('cors');
const mongoose=require('mongoose');
const roomRouter=require('./routes/roomRoute');
const dburi="mongodb+srv://testing_node:test1234@cluster0.jriry7x.mongodb.net/CollabCode?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(dburi)
.then((success)=>console.log('Database is connected!'))
.catch(err=>console.log(err));
const port = 5050;
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000','https://code-collab-rosy.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use('/api/room',roomRouter);
const server = createServer(app);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000','https://code-collab-rosy.vercel.app'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
})
const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
           // console.log(socketId);
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}
io.on('connection',(socket)=>{
    //console.log(socket.id);
    socket.on('join_room',({roomId,name})=>{
        userSocketMap[socket.id]=name;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach((client)=>{
            io.to(roomId).emit('joined_room',{name});
        })
    })
    socket.on('codechange',({roomId,value})=>{
       // console.log(value);
        socket.to(roomId).emit('room_codechange',{value});
    })
    
    socket.on('disconnect', () => {
       // console.log('User disconnected');
    });
})