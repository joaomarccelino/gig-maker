import HeaderLogo from '../../assets/imgs/header-logo.svg';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FaMusic } from 'react-icons/fa';
import { IoIosLogOut } from "react-icons/io";
import { IoMenuSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import './style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hook/AuthContext';
import { AiOutlineTool } from 'react-icons/ai';

type HeaderProps = {
  userId: string;
}


const Header = ({userId} : HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const {handleLogout} = useAuth()
  const navigate = useNavigate();

  const handleShowMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  }

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      navigate(`/search/${searchTerm}`)
    }
  }

  return (
    <header className="container">
      <div className="header">
        <a href="/home">
          <img src={HeaderLogo} className="header-logo" />
        </a>
        <input
          type="text"
          placeholder='Encontre músicos, gigs ou bandas'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />
        <div className="icons-nav-menu">
          <a href="/minhas-gigs">
            <BsFillPeopleFill color="var(--g5)" size={30} />
          </a>
          <a href="/">
            <FaMusic color="var(--g5)" size={30} />
          </a>
          <button onClick={handleLogout}className='icon-btn'>
            <IoIosLogOut color="red" size={30} />
          </button>
        </div>
        <div className="mobile-nav-menu">
          <button className='icon-btn' onClick={handleShowMobileMenu}>
            {
              showMobileMenu ?
                <IoClose color="var(--g5)" size={30} />
                :
                <IoMenuSharp color="var(--g5)" size={30} />
            }
          </button>
          {
            showMobileMenu
            &&
            <div className="icons-nav-menu-mobile">
              <a href="/">
                <BsFillPeopleFill color="var(--g5)" size={30} /> Músicos
              </a>
              <a href={`/user/${userId}`}>
                <BsFillPeopleFill color="var(--g5)" size={30} /> Meu Perfil
              </a>
              <a href={"/minhas-gigs"}>
                <BsFillPeopleFill color="var(--g5)" size={30} /> Minhas Gigs
              </a>
              <a href={`/user/editar/${userId}`}>
              <AiOutlineTool size={30} color="var(--g5)" /> Configurações
              </a>
              <button onClick={handleLogout} className='icon-btn'>
                <IoIosLogOut color="red" size={30} /> Sair
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  )
}

export default Header;