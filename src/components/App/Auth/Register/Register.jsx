import React from 'react'
import './Register.css'

import Input_1 from '../../../common/inputs/input_1/input_1'
import Button_1 from '../../../common/buttons/button_1/button_1'
import Button_2 from '../../../common/buttons/button_2/button_2'

function Register() {
    return (
        <div className="form-container" id='Register'>
            <div className="header-form">
                <h1>Sign up</h1>
            </div>
            <div className="body-form">
                <Input_1
                    name={"name"}
                    placeholder={"Write your name..."}
                    text={"Name"}
                    type={"text"}
                />
                <Input_1
                    name={"email"}
                    placeholder={"Write your email..."}
                    text={"Email"}
                    type={"email"}
                />
                <Input_1
                    name={"password"}
                    placeholder={"Write your password..."}
                    text={"Password"}
                    type={"password"}
                />
                <Button_1 
                    text={"Sign up"} />
                <h1>Or</h1>
                <Button_2 />
                <h1>Do have an account? <a onClick={()=>{
                    document.getElementById("Login").style.display = "block";
                    document.getElementById("Register").style.display = "none";
                }}>Log in</a></h1>
            </div>
        </div>
    )
}

export default Register