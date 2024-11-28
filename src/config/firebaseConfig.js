import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD1QpRUyenFjzkC9IfKNgZexYY7g_7dVzE",
  authDomain: "asistevoz.firebaseapp.com",
  projectId: "asistevoz",
  storageBucket: "asistevoz.appspot.com",
  messagingSenderId: "890722622801",
  appId: "1:890722622801:web:63bca54808b9ccbdebc770"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Configurar el proveedor de Google
const googleProvider = new GoogleAuthProvider();

// Inicializar la autenticación de Firebase
const auth = getAuth(app);

// Exportar todo correctamente
export { auth, googleProvider, signInWithPopup };
