import { handleGetUser } from './../user/index';
import { FeedPostProps } from './../../components/FeedPost/index';
import { doc, collection, addDoc, updateDoc, getDocs, getDoc, arrayUnion } from 'firebase/firestore';
import { firestore, storage } from '../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

type PostProps = {
  userId: string;
  postText: string;
}

type AddPostProps = {
  data: PostProps;
  image: File | undefined;
}

type Comment = {
  userId: string;
  text: string;
  date: string;
};

const handleAddPostImage = async (image: File, id: string) => {
  const postRef = doc(firestore, "posts", id);
  const imageRef = storageRef(storage, `${id}/${image.name}`);
  uploadBytes(imageRef, image).then(async snapshot => {
    const url = await getDownloadURL(snapshot.ref);
    await updateDoc(postRef, {
      postPhoto: url
    })
  })
}


export const handleAddPost = async ({data, image}: AddPostProps) => {
  const postRef = collection(firestore, "posts");
  await addDoc(postRef, data).then(value => {
    if (image !== undefined) {
      handleAddPostImage(image, value.path.replace('posts/', ''))
    }
  });
}

export const handleGetAllPosts = async () : Promise<FeedPostProps[]> => {
  const postsRef = collection(firestore, "posts");
  const postsSnapshot = await getDocs(postsRef);
  const postsData : FeedPostProps[] = await Promise.all(postsSnapshot.docs.map(async (postDoc) => {
    const postData = postDoc.data();
    const userData = await handleGetUser(postData.userId);
    const userInstruments = userData.instruments.map(i => i.value);
    const postResult: FeedPostProps = {
      id: postDoc.id,
      authorId: postData.userId,
      postPhoto: postData.postPhoto,
      postText: postData.postText,
      postComments: postData.postComments,
      profilePic: userData.profilePic,
      userName: userData.name,
      userInstruments: userInstruments.join(),
    }
    return postResult;
  }))
  return postsData;
}

export const handleGetUserPosts = async (id: string): Promise<FeedPostProps[]> => {
  const postsRef = collection(firestore, "posts");
  const postsSnapshot = await getDocs(postsRef);

  const postsData: FeedPostProps[] = (
    await Promise.all(postsSnapshot.docs.map(async (postDoc) => {
      const postData = postDoc.data();
      const userData = await handleGetUser(postData.userId);
      const userInstruments = userData.instruments.map((i) => i.value);
      const postResult: FeedPostProps = {
        id: postDoc.id,
        authorId: postData.userId,
        postPhoto: postData.postPhoto,
        postText: postData.postText,
        postComments: postData.postComments,
        profilePic: userData.profilePic,
        userName: userData.name,
        userInstruments: userInstruments.join(),
      };
      if (postResult.authorId === id) return postResult;
      return undefined; 
    }))
  ).filter((post): post is FeedPostProps => post !== undefined);

  return postsData;
};

export const addCommentToPost = async (postId: string, comment: Comment): Promise<void> => {
  const postRef = doc(firestore, "posts", postId);

  try {
    await updateDoc(postRef, {
      postComments: arrayUnion(comment),
    });
  } catch (error) {
    throw error;
  }
};
