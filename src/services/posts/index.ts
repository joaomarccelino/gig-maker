import { handleGetUser } from './../user/index';
import { FeedPostProps } from './../../components/FeedPost/index';
import { doc, collection, addDoc, updateDoc, getDocs, getDoc } from 'firebase/firestore';
import { firestore, storage } from '../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

type PostProps = {
  userId: string;
  postText: string;
}

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


export const handleAddPost = async (data: PostProps, image: File | undefined) => {
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
      postPhoto: postData.postPhoto,
      postText: postData.postText,
      postComments: postData.postComments,
      userThumb: userData.userThumb,
      userName: userData.name,
      userInstruments: userInstruments.join(),
    }
    return postResult;
  }))
  return postsData;
}