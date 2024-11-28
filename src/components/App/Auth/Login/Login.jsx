import React from 'react';
import './Login.css';
import Input_1 from '../../../common/inputs/input_1/input_1';
import Button_1 from '../../../common/buttons/button_1/button_1';
import Button_2 from '../../../common/buttons/button_2/button_2';  // Este es el botón de "Continue with Google"

function Login({ onGoogleLogin }) {  // Recibimos la función de login como prop
    return (
        <div className="form-container" id='Login'>
            <div className="header-form">
                <h1>Login</h1>
            </div>
            <div className="body-form">
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
                <Button_1 text={"LogIn"} />
                <h1>Or</h1>
                {/* Aquí pasamos la función handleGoogleLogin al Button_2 */}
                <Button_2 onClick={onGoogleLogin} />  {/* Este es el botón de "Continue with Google" */}
                <h1>Don´t have an account? <a
                    onClick={() => {
                        document.getElementById('Login').style.display = 'none';
                        document.getElementById('Register').style.display = 'block';
                    }}
                >Sign up</a></h1>
            </div>
        </div>
    );
}

export default Login;
