import { BsImage, BsYoutube } from 'react-icons/bs';
import './style.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../hook/AuthContext';
import { ChangeEvent, useState } from 'react';
import { handleAddPost } from '../../services/posts';
import compressImage from '../../services/posts/compressImage';
import { useMutation, useQueryClient } from 'react-query';

type PostInputs = {
  postText: string;
}

const PostInput = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm<PostInputs>();
  const [postPic, setPostPic] = useState<File>();
  const [postPicName, setPostPicName] = useState<string>();
  const [postPicURL, setPostPicURL] = useState<string>();

  const queryClient = useQueryClient();
  const {
    mutate: createNewPost,
  } = useMutation(handleAddPost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['gig-maker-posts']);
      reset()
      setPostPic(undefined);
      setPostPicName('');
      setPostPicURL('');
    }
  })

  const onSubmit: SubmitHandler<PostInputs> = async (data) => {
    if (postPic) {
        const compressedImage = await compressImage(postPic, 0.6);
        const newPostData = {
          userId: user?.id || '',
          postText: data.postText,
          postPhoto: ''
        }
        createNewPost({data: newPostData, image: compressedImage});
    } else {
      const newPostData = {
        userId: user?.id || '',
        postText: data.postText,
        postPhoto: ''
      }
      createNewPost({data: newPostData, image: postPic});
    }
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
      <img src={user?.profilePic} alt="Perfil" className='user-thumb post-input-user-thumb' />
      {
        postPic && <img className='post-picture-photo' src={postPicURL} />
      }
      <textarea id="" cols={30} rows={10} placeholder="Qual a boa pra hoje?" {...register("postText")} />
      <div className="post-menu">
        <label htmlFor="imageInput" className="image-input-label">
          <BsImage color='var(--p3)' size={30} />
          <input type="file" accept="image/png, image/jpg, image/jpeg" id="imageInput" onChange={saveImage} />
        </label>
      </div>
      <button type='submit' className="register-btn send-btn">Enviar</button>
    </form>
  )
}

export default PostInput;