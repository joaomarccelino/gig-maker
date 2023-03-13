import {BsMusicNote} from 'react-icons/bs';
import {GoComment} from 'react-icons/go';

import './style.css';
type Comments = {
  userName: string;
  text: string;
  date: string;
}

export interface FeedPostProps {
  id: string;
  userThumb: string;
  userName: string;
  userInstruments: string;
  postPhoto?: string;
  postVideoLink?: string;
  postText: string;
  postComments: Comments[];
}

const FeedPost = ({userThumb, userName, userInstruments, postPhoto, postText, postComments}: FeedPostProps) => {
  return (
    <div className="feed-post">
      <div className="post-header">
        <img src={userThumb} alt={userName} className="user-thumb" />
        <h2>{userName}</h2>
        <span>({userInstruments})</span>
      </div>
      <img src={postPhoto} alt="Foto" className="post-photo" />
      <div className="feed-post-menu">
        <button className="icon-btn">
          <BsMusicNote size={40} color="var(--g12)"/>
        </button>
        <button className="icon-btn">
          <GoComment size={40} color="var(--g12)"/>
        </button>
      </div>
      <p className='post-text'>{postText}</p>
      <input type="text" placeholder="Adicione um comentário" className='feed-post-input' />
    </div> 
  )
}

export default FeedPost;