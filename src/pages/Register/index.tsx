import Header from '../../components/Header';
import {AiOutlineCamera} from 'react-icons/ai';
import {BiImageAdd} from 'react-icons/bi';
import './style.css'

const Register = () => {
  return (
    <>
      <Header />
      <main className='container register'>
        <h1 className='register-title'>Antes de começar, preencha algumas informações</h1>
        <div className="profile-pic-area">
          <div className="profile-pic-btns">
            <div className="profile-pic-btn">
              <AiOutlineCamera size={35} />
              <p>Tirar foto</p>
            </div>
            <div className="profile-pic-btn">
              <BiImageAdd size={35} />
              <p>Escolher arquivo</p>
            </div>
          </div>
        </div>
        <h2 className="register-subtitle">Foto de perfil</h2>
        <form className="register-form">
          <label htmlFor="name">Nome</label>
          <input type="text" id="name" />
          <label htmlFor="state">Estado</label>
          <select name="state" id="state">

          </select>
          <label htmlFor="spot-playlist">Playlist de referência Spotify</label>
          <input type="text" id="spot-playlist" />
          <label htmlFor="instruments">Instrumentos que você toca</label>
          <select name="instruments" id="instruments">

          </select>
          <button className="register-btn">Adicionar instrumento</button>
          <label htmlFor="about-you">Fale um pouco sobre você</label>
          <textarea name="about-you" id="about-you" cols={30} rows={10} />
          <div className="center-btn">
            <button type='submit' className='register-btn' >Enviar</button>
          </div>
        </form>

      </main>
    </>

  )
}

export default Register;