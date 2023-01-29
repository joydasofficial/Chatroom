import React, {useState, useEffect} from 'react'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { io } from 'socket.io-client'

const inter = Inter({ subsets: ['latin'] })

const Home = ()=> {
  const [msg, setMsg] = useState([])
  const [room, setRoom] = useState('')
  const [text, setText] = useState('')
  const socket = io('http://localhost:8000/')

  useEffect(()=>{
    console.log(msg);
    socket.on('chat-message', handleMessage)
  },[msg])

  const handleMessage = (message) => {
    setMsg([ ...msg,message]);
  }

  const handleSubmit = () => {
    let id = [];
    socket.emit('chat-message', text);
    socket.on('chat-message', handleMessage)

    socket.emit('myid', socket.id);
    socket.on('myid', id => console.log(id))

    console.log('socketId', id);
  }

  return (
    <>
      <div>
        <div>
          <ul>
            {msg.map((chatmsg, id)=>{
              return <li key={id}>{chatmsg}</li>
            })}
          </ul>
        </div>
      </div>
      <div >
        <input type='text' name='message' value={text} onChange={(e)=>setText(e.target.value)} />
        <button onClick={handleSubmit}>Send</button>
      </div>
    </>
  )
}

export default Home