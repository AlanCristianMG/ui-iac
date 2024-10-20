import React, { useEffect } from 'react'
import './Auth.css'
import Login from './Login/Login'
import Register from './Register/Register'

function Auth() {
    
    useEffect(() => {
        document.getElementById('Register').style.display = "none";
    },[])

  return (
    <div id='Auth'>
        <div className="bg-shape shape-one"></div>
        <div className="bg-shape shape-two"></div>
        <Login/>
        <Register/>
    </div>
  )
}

export default Auth
