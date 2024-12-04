import React, { useEffect, useState } from 'react';
import './Auth.css';
import Login from './Login/Login';   // Componente Login
import Register from './Register/Register'; // Componente Register
import Button_3 from '../../common/buttons/button_3/button_3'; 
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../../../config/firebaseConfig'; // Asegúrate de la ruta correcta

function Auth() {
  const navigate = useNavigate();  // Hook para redirigir a otra página

  const [user, setUser] = useState({
    email: '',
    password: '',
    name: ''
  });

  // Ocultar el formulario de registro inicialmente
  useEffect(() => {
    document.getElementById('Register').style.display = "none";
  }, []);

  // Función para manejar el inicio de sesión con Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // El usuario ha iniciado sesión con Google
      const user = result.user;
      console.log('Usuario de Google:', user);
      
      // Añadimos un console.log para ver si la redirección se ejecuta
      console.log('Redirigiendo a /home');
      navigate('/home');  // Redirige a '/home' después del login exitoso
    } catch (error) {
      console.error("Error de autenticación:", error.message);
    }
  };

  return (
    <div id='Auth'>
      <div className="back-button">
        <Button_3 target={'/'} text={'Back'} />
      </div>
      <div className="bg-shape shape-one"></div>
      <div className="bg-shape shape-two"></div>

      {/* Aquí pasa la función handleGoogleLogin a Login como prop */}
      <Login onGoogleLogin={handleGoogleLogin} />

      {/* Aquí está tu componente de Register */}
      <Register />
    </div>
  );
}

export default Auth;
