
import { Route, Routes } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import 'bootstrap'
import { AuthProvider } from './context/authContext';
import Auth from './components/App/Auth/Auth';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/auth' element={<Auth/>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
