import './global.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router';
import Auth from './pages/Auth';
import Register from './pages/Register';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import BandProfile from './pages/BandProfile';
import BandRegister from './pages/BandRegister';
import { AuthContextProvider } from './hook/AuthContext';

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/registro/:id" element={<Register />} />
            <Route path='/home' element={<Home />} />
            <Route path='/user/:id' element={<UserProfile />} />
            <Route path='/band/:id' element={<BandProfile />} />
            <Route path='band-register' element={<BandRegister />} />
          </Routes>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
