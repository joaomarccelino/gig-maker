import { useState } from "react";
import { ImGoogle2} from "react-icons/im";
import './style.css';
type SignModalProps = {
  title: string;
  buttonText: string;
  onClose: () => void;
}

const SignModal = ({title, buttonText, onClose}: SignModalProps) => {
  const [signModalText, setSignModalText] = useState({
    title, buttonText
  });
  const [isLogin, setIsLogin] = useState(title === "Login" ? true: false);
  const loginText = {
    title: "Login",
    buttonText: "Entrar com",
  }
  const signText = {
    title: "Crie sua conta",
    buttonText: "Cadastre-se com",
  }

  const handleLoginToSign = () => {
    setIsLogin(false);
    setSignModalText(signText);
  }

  const handleSignToLogin = () => {
    setIsLogin(true);
    setSignModalText(loginText);
  }

  return (
    <div className="sign-bg">
      <div className="sign-modal">
        <h2 className="signTitle">{signModalText.title}<span className="highlight">.</span></h2>
        <button className="sign-modal-btn"><span>{signModalText.buttonText} com google</span><ImGoogle2 size={40} /></button>
        {
          isLogin ? 
          <p>Ainda não tem uma conta? <button onClick={handleLoginToSign} className="text-btn">Cadastre-se já</button></p> :
          <button className="text-btn" onClick={handleSignToLogin}>Já tem uma conta?</button>
        }
        <button
          className="close-button"
          onClick={onClose}
        >
          X
        </button>
      </div>
    </div>
  )
}

export default SignModal;