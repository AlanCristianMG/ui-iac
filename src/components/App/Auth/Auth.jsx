import React, { useEffect, useState } from 'react'
import './Auth.css'
import Login from './Login/Login'
import Register from './Register/Register'
import Button_3 from '../../common/buttons/button_3/button_3';

function Auth() {

  const [user, setUSer] = useState({
    email: '',
    password: '',
    name: ''
  });


  useEffect(() => {
    document.getElementById('Register').style.display = "none";
  }, [])

  return (
    <div id='Auth'>
      <div className="back-button">
        <Button_3 target={'/'} text={'Back'} />
      </div>
      <div className="bg-shape shape-one"></div>
      <div className="bg-shape shape-two"></div>
      <Login />
      <Register />
    </div>
  )
}

export default Auth
