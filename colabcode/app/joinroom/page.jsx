"use client";

import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Alert } from '@mui/material';
import Image from 'next/image';
const JoinRoom = () => {

  const [roomList, setRoomList] = useState(null);
  const [status,setAlertStatus]=useState(null);
  const [userName,setUsername]=useState(null);
  const [roomName,setRoomName]=useState(null);
  useEffect(() => {

    const getAllrooms = async () => {
      try {
        const res = await axios.get('https://codecollab-1.onrender.com/api/room/getallrooms');
        setRoomList(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    getAllrooms();
    

  }, [])

  const handleJoinRoom = async (room) => {
    console.log(room);
    try {
      const res = await axios.post("https://codecollab-1.onrender.com/api/room/joinroom", { roomName:room.roomName, roomPassword:room.roomPassword});
      console.log(res.data);
      setAlertStatus('success');
      window.location.href = `/codeeditor?id=${res.data._id}&name=${userName}`
    } catch (err) {
      setAlertStatus('error');
      console.log(err);
    }
  }

  const handleSearch=async()=>{
    try{
      const res=await axios.post('https://codecollab-1.onrender.com/api/room/getroombyname',{roomName})
      //console.log(res.data);
      setRoomList(res.data);
    }catch(err){
      console.log(err);
    }
  }
  return (
    <React.Fragment>
    {status && <Alert className='fixed top-0' severity={status && status}>{status==='success'?"Room joined successfully! Redirecting...":"Error in joining the room!"}</Alert>}
      <div className='bg-black p-4 text-white w-full h-screen'>
      <div className='flex'>
      <Image src='/Codinglogo.jpg' height={30} width={30} className='rounded-md mr-2'></Image>
        <p className='text-2xl'>CodeCollab</p>
        </div>
        <p className='mt-2'>Available Rooms:</p>
        <input type='text' placeholder='Search By name' className='outline-none border-none rounded-md text-black px-2 mb-4' onChange={(e)=>setRoomName(e.target.value)}></input>
        <button className='bg-green-600 px-2 py-1 rounded-md w-fit h-fit ml-4' onClick={handleSearch}>Search</button>
        <button className='bg-green-600 px-2 py-1 rounded-md w-fit h-fit ml-4' onClick={()=>window.location.href='/createroom'}>Create own Room</button>
        <div className='w-full h-fit bg-slate-700 rounded-lg p-4'>
          {roomList && roomList.map((room, ind) => (
            <div key={ind} className='room_display' style={{ 'marginBottom': '1rem' }}>
              <h3>{room.roomName}</h3>
              <input type='text' placeholder='join in as' className='px-2 text-black mr-2'  onChange={(e)=>setUsername(e.target.value)}></input>
              <button className='bg-green-600 px-2 py-1 rounded-md w-fit h-fit' onClick={() => handleJoinRoom(room)}>Join Room</button>
            </div>
          ))}
        </div>
      </div>

    </React.Fragment>

  )
}

export default JoinRoom