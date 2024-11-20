import { IoMenuSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import './style.css';
import { useState } from 'react';

type LpHeaderProps ={
  bandName: string;
}

const LpHeader = ({bandName}: LpHeaderProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleShowMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  }


  return (
    <header className="container">
      <div className="lp-header">
        <a href="/home">
          <span className='band-logo'>{bandName}</span>
        </a>
        <nav className='lp-nav'>
        <ul className='lp-nav-menu'>
          <li>
            <a className='lp-nav-menu-item' href="#about">Sobre</a>
          </li>
          <li>
            <a className='lp-nav-menu-item' href="#setlist">Repertório</a>
          </li>
        </ul>
        <button className='icon-btn mobile-btn' onClick={handleShowMobileMenu}>
          {
            showMobileMenu ?
              <IoClose color="var(--g2)" size={30} />
              :
              <IoMenuSharp color="var(--g2)" size={30} />
          }
        </button>
        {
          showMobileMenu
          &&
          <ul className='lp-mobile-nav-menu'>
            <li>
              <a className='lp-nav-menu-item' href="#about">Sobre</a>
            </li>
            <li>
              <a className='lp-nav-menu-item' href="#setlist">Repertório</a>
            </li>
          </ul>
        }

      </nav>
      </div>
    </header>
  )
}

export default LpHeader;