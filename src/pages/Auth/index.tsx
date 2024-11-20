import { useEffect, useState } from "react";
import AuthHeader from "../../components/AuthHeader";
import SignModal from "../../components/SignModal";
import './style.css';
import { useAuth } from "../../hook/AuthContext";
import { useNavigate } from "react-router-dom";
const Auth = () => {
  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  const {user} = useAuth();

  const navigate = useNavigate();

  const handleShowSignModal = () => {
    setShowSignModal(true);
  }


  return (
    <main className="auth-page">
      <AuthHeader />
      <div className="page-info">
        <h1>Compartilhe seu talento<span className="highlight-text">.</span></h1>
        <p>Encontre sua <span className="highlight-text">GIG</span> ou</p>
        <p>Encontre os <span className="highlight-text">músicos</span> que faltam para sua banda.</p>
        <button className="sign-btn" onClick={handleShowSignModal}>Cadastre-se agora</button>
      </div>
      {
        showSignModal &&
        <SignModal title="Crie sua conta" buttonText="Cadastre-se com" onClose={() => setShowSignModal(false)} />
      }
    </main>
  )
}

export default Auth;