import HeaderLogo from '../../assets/imgs/header-logo.svg';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FaMusic } from 'react-icons/fa';
import { IoNotifications } from 'react-icons/io5';
import './style.css';

const Header = () => {
  return (
    <header className="container">
      <div className="header">
        <a href="/">
          <img src={HeaderLogo} />
        </a>
        <input 
        type="text" 
        placeholder='Encontre músicos, gigs ou bandas'
        />
        <div className="icons-nav-menu">
          <a href="/">
            <BsFillPeopleFill color="var(--g5)" size={30}/>
          </a>
          <a href="/">
            <FaMusic color="var(--g5)" size={30}/>
          </a>
          <a href="/">
            <IoNotifications color="var(--g5)" size={30}/>
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header;