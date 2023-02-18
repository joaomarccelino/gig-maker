import './global.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router';
import Auth from './pages/Auth';
import Register from './pages/Register';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Auth />}/>
          <Route path="/registro/:id" element={<Register />}/>
          <Route path='/home' element={<Home />} />
          <Route path='/user/:id' element={<UserProfile />} />
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
