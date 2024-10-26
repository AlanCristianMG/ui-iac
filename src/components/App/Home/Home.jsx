import React from 'react'
import './Home.css'
import Chat from './Chat/Chat'
import Drawer from './Drawer/Drawer'

function Home() {
  return (
    <div className="Home">
      <Drawer/>
      <Chat/>
    </div>
  )
}

export default Home
