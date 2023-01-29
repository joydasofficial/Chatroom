import React, { useState } from 'react'
import { io } from 'socket.io-client'

const Joinroom = () => {

  const [room, setRoom] = useState('')
  const [username, setUsername] = useState('')

  const socket = io('http://localhost:8000/')
  
  const handleJoinRoom = () => {
    socket.emit('join-room', {username, room})
    socket.on('receive-msg', ({message, username, createdat})=>{
      console.log(message);
    })
  }

  return (
    <div>
      <input type='text' name='username' value={username} onChange={(e)=>{setUsername(e.target.value)}} placeholder='Enter username' />
      <input type='text' name='room' value={room} onChange={(e)=>{setRoom(e.target.value)}} placeholder='Enter room name' />
      <button onClick={()=>handleJoinRoom()}>Join Room</button>
    </div>
  )
}

export default Joinroom