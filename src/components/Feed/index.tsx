import React from "react";
import FeedPost, { FeedPostProps } from "../FeedPost";
import './style.css';

type FeedProps = {
  posts: FeedPostProps[]
}

const Feed = ({posts}: FeedProps) => {
  return <div className="feed">
    {posts.map(post => {
      return <FeedPost key={post.id} id={post.id} authorId={post.authorId} userThumb={post.userThumb} userName={post.userName} userInstruments={post.userInstruments} postPhoto={post.postPhoto} postText={post.postText} postComments={post.postComments} />;
    })}
  </div>;
}


export default Feed;