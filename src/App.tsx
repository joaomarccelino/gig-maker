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
import MyGigs from './pages/MyGigs';
import SearchPage from './pages/SearchPage';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/registro/:id" element={<Register />} />
            <Route path='/home' element={<Home />} />
            <Route path='/search/:searchTerm' element={<SearchPage />} />
            <Route path='/user/:id' element={<UserProfile />} />
            <Route path='/banda/:id' element={<BandProfile />} />
            <Route path='registro-banda' element={<BandRegister />} />
            <Route path='minhas-gigs' element={<MyGigs/>} />
            <Route path='meus-anuncios' />
          </Routes>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
