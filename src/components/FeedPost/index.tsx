import { BsMusicNote } from 'react-icons/bs';
import { GoComment } from 'react-icons/go';

import './style.css';
type Comments = {
  userName: string;
  text: string;
  date: string;
}

export interface FeedPostProps {
  id: string;
  authorId: string;
  profilePic: string;
  userName: string;
  userInstruments: string;
  postPhoto?: string;
  postVideoLink?: string;
  postText: string;
  postComments: Comments[];
}

const FeedPost = ({ id, authorId, profilePic, userName, userInstruments, postPhoto, postText, postComments }: FeedPostProps) => {
  return (
    <div className="feed-post">
      <div className="post-header">
        <a href={`/user/${authorId}`}>
          <img src={profilePic} alt={userName} className="user-thumb" />
        </a>
        <a href={`/user/${authorId}`}>
          <h2>{userName}</h2>
        </a>
        <span>({userInstruments})</span>
      </div>
      {postPhoto && <img src={postPhoto} alt="Foto" className="post-photo" />}
      <div className="feed-post-menu">
        <button className="icon-btn">
          <BsMusicNote size={40} color="var(--g12)" />
        </button>
        <button className="icon-btn">
          <GoComment size={40} color="var(--g12)" />
        </button>
      </div>
      <p className='post-text'>{postText}</p>
      <input type="text" placeholder="Adicione um comentário" className='feed-post-input' />
    </div>
  )
}

export default FeedPost;