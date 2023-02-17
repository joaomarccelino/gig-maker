import ProfileTest from '../../assets/imgs/profile-test.png';
import { BsImage, BsYoutube } from 'react-icons/bs';
import './style.css';

const PostInput = () => {
  return (
    <div className="post-input">
      <img src={ProfileTest} alt="Perfil" className='user-thumb post-input-user-thumb' />
      <textarea name="" id="" cols={30} rows={10} placeholder="Como vai a sua música?"/>
      <div className="post-menu">
        <button className='icon-btn'>
          <BsImage color='var(--p3)' size={30} />
        </button>
        <button className='icon-btn' >
          <BsYoutube color='var(--p3)' size={30} />
        </button>
      </div>
      <button className="register-btn send-btn">Enviar</button>
    </div>
  )
}

export default PostInput;