import { useState } from 'react';
import HeaderLogo from '../../assets/imgs/header-logo.svg';
import SignModal from '../SignModal';
import './style.css';
import { IoClose, IoMenuSharp } from 'react-icons/io5';

type SignModalText = {
  title: string;
  buttonText: string;
}

const AuthHeader = () => {
  const [signModalText, setSignModalText] = useState<SignModalText>()
  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleShowMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  }

  const handleShowSignModal = (mode: string) => {
    if (mode === "sign") {
      setSignModalText({
        title: "Crie sua conta",
        buttonText: "Cadastre-se com"
      })
      setShowSignModal(true);
    } else {
      setSignModalText({
        title: "Login",
        buttonText: "Entre com"
      })
      setShowSignModal(true);
    }
  }
  return (
    <header className='container auth-header'>
      <a href="">
        <img src={HeaderLogo} />
      </a>
      <ul className="nav-menu">
        <li>
          <a href="/about">Sobre</a>
        </li>
        <li>
          <a href="/about">Contato</a>
        </li>
        <li>
          <button className='sign-btn-no-bg' onClick={() => handleShowSignModal("login")}>Login</button>
        </li>
        <li>
          <button className="sign-btn" onClick={() => handleShowSignModal("sign")}>Cadastro</button>
        </li>
      </ul>
      <div className="mobile-auth-menu">
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
          <ul>
            <li>
              <a href="/about">Sobre</a>
            </li>
            <li>
              <a href="/about">Contato</a>
            </li>
            <li>
              <button className='sign-btn-no-bg' onClick={() => handleShowSignModal("login")}>Login</button>
            </li>
            <li>
              <button className="sign-btn" onClick={() => handleShowSignModal("sign")}>Cadastro</button>
            </li>
          </ul>
        }
      </div>
      {
        showSignModal && signModalText &&
        <SignModal title={signModalText?.title} buttonText={signModalText?.buttonText} onClose={() => setShowSignModal(false)} />
      }
    </header>
  )
}

export default AuthHeader;