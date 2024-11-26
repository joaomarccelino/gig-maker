import { AiOutlineUser, AiTwotoneNotification, AiOutlineTool } from 'react-icons/ai';
import { BsFillPeopleFill } from 'react-icons/bs';
import './style.css';
import { useEffect, useState } from 'react';

type SideMenuProps = {
  userId: string;
}

const SideMenu = ({ userId }: SideMenuProps) => {

  const [iconSize, setIconSize] = useState(40);
  useEffect(() => {
    function handleResize() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 900) {
        setIconSize(30);
      } else if (screenWidth < 500) {
        setIconSize(20);
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className='side-menu'>
      <ul className='side-menu-items'>
        <li className='side-menu-item'>
          <a href={`/user/${userId}`}>
            <AiOutlineUser size={iconSize} color="var(--g6)" />
            <p className='side-menu-text'>Meu perfil</p>
          </a>
        </li>
        <li className='side-menu-item'>
          <a href="/minhas-gigs">
            <BsFillPeopleFill size={iconSize} color="var(--g6)" />
            <p className='side-menu-text'>Minhas gigs</p>
          </a>
        </li>
        <li className='side-menu-item'>
          <a href={`/user/editar/${userId}`}>
            <AiOutlineTool size={iconSize} color="var(--g6)" />
            <p className='side-menu-text'>Configurações</p>
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default SideMenu;