import ProfileTest from '../../assets/imgs/profile-test.png';
import { BsImage, BsYoutube } from 'react-icons/bs';
import './style.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../hook/AuthContext';
import { ChangeEvent, useState } from 'react';
import { handleAddPost } from '../../services/posts';

type PostInputs = {
  postText: string;
}

const PostInput = () => {
  const { user } = useAuth();
  const { register, handleSubmit } = useForm<PostInputs>();
  const [postPic, setPostPic] = useState<File>();
  const [postPicName, setPostPicName] = useState<string>();
  const [postPicURL, setPostPicURL] = useState<string>();
  const onSubmit: SubmitHandler<PostInputs> = async (data) => {
    const newPostData = {
      userId: user.uid,
      postText: data.postText,
      postPhoto: ''
    }
    handleAddPost(newPostData, postPic)
    console.log(data);
  }

  function saveImage(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setPostPic(e.target.files[0])
      setPostPicName(e.target.files[0].name);
      setPostPicURL(URL.createObjectURL(e.target.files[0]))
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="post-input">
      <img src={user.userThumb} alt="Perfil" className='user-thumb post-input-user-thumb' />
      {
            postPic && <img className='post-picture-photo' src={postPicURL} />
          }
      <textarea id="" cols={30} rows={10} placeholder="Qual a boa pra hoje?" {...register("postText")} />
      <div className="post-menu">
        <label htmlFor="imageInput" className="image-input-label">
          <BsImage color='var(--p3)' size={30} />
          <input type="file" accept="image/png, image/jpg, image/jpeg" id="imageInput" onChange={saveImage} />
        </label>
        <button className='icon-btn' >
          <BsYoutube color='var(--p3)' size={30} />
        </button>
      </div>
      <button type='submit' className="register-btn send-btn">Enviar</button>
    </form>
  )
}

export default PostInput;