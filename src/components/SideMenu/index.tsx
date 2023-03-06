import {AiOutlineUser, AiTwotoneNotification, AiOutlineTool} from 'react-icons/ai';
import { BsFillPeopleFill } from 'react-icons/bs';
import './style.css';

type SideMenuProps = {
  userId: string;
}

const SideMenu = ({userId}: SideMenuProps) => {
  return (
    <nav className='side-menu'>
      <ul className='side-menu-items'>
        <li className='side-menu-item'>
          <a href={`/user/${userId}`}>
            <AiOutlineUser size={40} color="var(--g6)" />
            <p className='side-menu-text'>Meu perfil</p>            
          </a>
        </li>
        <li className='side-menu-item'>
          <a href="/">
            <BsFillPeopleFill size={40} color="var(--g6)" />
            <p className='side-menu-text'>Minhas gigs</p>
          </a>
        </li>
        <li className='side-menu-item'>
          <a href="/">
            <AiTwotoneNotification size={40} color="var(--g6)" />
            <p className='side-menu-text'>Meus anúncios</p>
          </a>
        </li>
        <li className='side-menu-item'>
          <a href="/">
            <AiOutlineTool size={40} color="var(--g6)" />
            <p className='side-menu-text'>Configurações</p>
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default SideMenu;