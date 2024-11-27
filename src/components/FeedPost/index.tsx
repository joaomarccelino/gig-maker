import React, { useEffect, useState } from 'react';
import { BsMusicNote } from 'react-icons/bs';
import { GoComment } from 'react-icons/go';
import { useMutation, useQueryClient } from 'react-query';

import './style.css';
import { addCommentToPost } from '../../services/posts';
import { getUserById } from '../../services/user';
import { useAuth } from '../../hook/AuthContext';

type Comments = {
  userId: string;
  text: string;
  date: string;
};

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

const FeedPost = ({
  id,
  authorId,
  profilePic,
  userName,
  userInstruments,
  postPhoto,
  postText,
  postComments,
}: FeedPostProps) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [commentsWithUserNames, setCommentsWithUserNames] = useState<
    { text: string; date: string; userName: string; userId: string; }[]
  >([]);

  const queryClient = useQueryClient();

  const { mutate: addNewComment } = useMutation(
    async ({ postId, comment }: { postId: string; comment: Comments }) => {
      await addCommentToPost(postId, comment);
      const user = await getUserById(comment.userId);
      return { ...comment, userName: user.name };
    },
    {
      onSuccess: (newCommentWithName) => {
        setCommentsWithUserNames((prev) => [...prev, newCommentWithName]);
        setCommentText('');
        queryClient.invalidateQueries(['gig-maker-posts']);
      },
      onError: (error) => {
        console.error('Erro ao adicionar comentário:', error);
      },
    }
  );

  useEffect(() => {
    const fetchCommentUserNames = async () => {
      const updatedComments = await Promise.all(
        postComments.map(async (comment) => {
          try {
            const user = await getUserById(comment.userId);
            return {
              text: comment.text,
              date: comment.date,
              userName: user.name,
              userId: comment.userId
            };
          } catch (error) {
            console.error('Erro ao buscar nome do usuário:', error);
            return {
              text: comment.text,
              date: comment.date,
              userName: 'Usuário desconhecido',
              userId: comment.userId
            };
          }
        })
      );
      setCommentsWithUserNames(updatedComments);
    };

    fetchCommentUserNames();
  }, [postComments]);


  const handleAddNewComment = async () => {
    if (!commentText.trim()) return;

    const newComment: Comments = {
      userId: user?.id || '',
      text: commentText.trim(),
      date: new Date().toISOString(),
    };

    addNewComment({ postId: id, comment: newComment });
  };

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
      <p className="post-text">{postText}</p>

      <div className="comments-section">
        <ul>
          {commentsWithUserNames.map((comment, index) => (
            <li key={index}>
              <a href={`/user/${comment.userId}`}>
                <strong>{comment.userName}</strong></a> ({new Date(comment.date).toLocaleString()}): {comment.text}

            </li>
          ))}
        </ul>
        <div className="comment-input-btn">
          <input
            type="text"
            placeholder="Adicione um comentário"
            className="feed-post-input"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className='comment-btn' onClick={handleAddNewComment}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default FeedPost;
