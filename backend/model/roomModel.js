const mongoose=require('mongoose');
const RoomSchema=new mongoose.Schema({
    roomName:{
        type:String,
        required:true,
        unique:true,
    },
    roomPassword:{
        type:String,
        required:true
    },
    code:{
        type:String,
    }
},{timestamps:true});
const Room=mongoose.model('room',RoomSchema);
module.exports=Room;