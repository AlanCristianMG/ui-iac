
import { Route, Routes } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import 'bootstrap'
import { AuthProvider } from './context/authContext';
import Auth from './components/App/Auth/Auth';
import Home from './components/App/Home/Home';

function App() {


  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
