const Room=require('../model/roomModel');
const createRoom=async(req,res)=>{
    const { roomName, roomPassword } = req.body;
    try {
        const getRoom = await Room.findOne({ roomName })
        if (getRoom) return res.status(400).send('room already exists');
        else {
            const room = await Room.create({ roomName, roomPassword });
            return res.status(200).json(room);
        }

    } catch (err) {
        res.status(400).send('Error in creating the room!')
    }
}

const joinRoom=async(req,res)=>{
    const {roomName, roomPassword} = req.body;
    try {
        const room = await Room.findOne({ roomName });
        if (!room) return res.status(400).send('Room not found');
        if (room.roomPassword !== roomPassword) return res.status(400).send('Password mismatch');
        res.status(200).json(room);
    } catch (err) {
        return res.status(400).send('Error in joining the room!')
    }
}

const getAllRooms=async(req,res)=>{
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (err) {
        res.status(400).send('Error in getting all rooms!')
    }
}

const saveCode=async(req,res)=>{
    const {roomId,code}=req.body;
    console.log(code);
    try{
        const room=await Room.findByIdAndUpdate(roomId,{code},{new:true});
        return res.status(200).json(room);
    }
    catch(err){
        return res.status(400).send('Error in saving code');
    }
}



const getRoomById=async(req,res)=>{
    const query=req.query.q;
    try{
        const room=await Room.findById(query).sort({ updatedAt: -1 });
        return res.status(200).json(room);
    }catch(err){
        return res.status(400).send('Error in fetching the room!')
    }
}

const getRoomByName=async(req,res)=>{
    const {roomName}=req.body;
    try{
        const arr=[];
        const room =await Room.findOne({roomName:roomName});
        if(room===null){
            const rooms = await Room.find();
            return res.status(200).json(rooms);
        }
        arr.push(room);
        //console.log(room);
        return res.status(200).json(arr);
    }catch(err){
        return res.status(400).send('Error in fetching the room!')
    }
}
module.exports={createRoom,joinRoom,getAllRooms,getRoomById,saveCode,getRoomByName};