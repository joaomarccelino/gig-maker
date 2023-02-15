import { useState } from 'react';
import HeaderLogo from '../../assets/imgs/header-logo.svg';
import SignModal from '../SignModal';
import './style.css';

type SignModalText = {
  title: string;
  buttonText: string;
}

const AuthHeader = () => {
  const [signModalText, setSignModalText] = useState<SignModalText>()
  const [showSignModal, setShowSignModal] = useState<boolean>(false);
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
          <button className='sign-btn-no-bg'  onClick={() => handleShowSignModal("login")}>Login</button>
        </li>
        <li>
          <button className="sign-btn" onClick={() => handleShowSignModal("sign")}>Cadastro</button>
        </li>
      </ul>
     {
      showSignModal && signModalText &&
      <SignModal title={ signModalText?.title } buttonText={ signModalText?.buttonText}  onClose={() => setShowSignModal(false)} />
     }
    </header>
  )
}

export default AuthHeader;