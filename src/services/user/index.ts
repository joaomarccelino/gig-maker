import { instruments } from './../../utils/commonData';
import { addDoc, collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"
import { firestore, storage } from "../firebase"
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { User } from "../../hook/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

type UserRegisterProps = {
  id: string;
  data: User;
  image: File;
}


export const handleAddUserImage = async (id: string, image: File) => {
  const usersRef = doc(firestore, "users", id);
  const imageRef = storageRef(storage, `${id}/${image.name}`);
  uploadBytes(imageRef, image).then(async snapshot => {
    const url = await getDownloadURL(snapshot.ref);
    await updateDoc(usersRef, {
      profilePic: url,
      userThumb: url
    })
  })
}

export const handleUserRegister = async ({ id, data, image }: UserRegisterProps) => {
  await setDoc(doc(firestore, "users", id), data).then(_ => {
    handleAddUserImage(id, image);
  })
}

export const handleGetUsers = async () => {
  const dbRef = collection(firestore, "users");
  try {
    const querySnapshot = await getDocs(dbRef);
    let usersData: User[] = [];
    querySnapshot.forEach((doc) => {
      const snapData = {
        id: doc.id,
        name: doc.data().name,
        about: doc.data().about,
        city: doc.data().city,
        coverPic: doc.data().coverPic,
        district: doc.data().district,
        instruments: doc.data().instruments,
        phone: doc.data().phone,
        profilePic: doc.data().profilePic,
        spotRef: doc.data().spotRef,
        uid: doc.data().uid,
        type: doc.data().type,
        userThumb: doc.data().userThumb
      }
      usersData.push(snapData);
    })
    return usersData;
  } catch (error) {
    throw new Error();
  }
}

export const handleGetUser = async (id: string) => {
  const userRef = doc(firestore, "users", id);
  try {
    let userData: User = { } as User;
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      userData = {
        id: data.uid,
        about: data.about,
        city: data.city,
        coverPic: data.coverPic,
        district: data.district,
        instruments: data.instruments,
        name: data.name,
        profilePic: data.profilePic,
        spotRef: data.spotRef,
        type: data.type,
        userThumb: data.userThumb
      }
    }
    return userData;
  } catch (error) {
    throw new Error();
  }
}

export const distanceCalculator = async (city1: string, city2: string) => {
  const apiKey = process.env.REACT_APP_DISTANCE_KEY;
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${city1}&end=${city2}`;
  const response = await axios.get(url);
  const data = response.data;
  const distance = data.features[0].properties.segments[0].distance;
  return distance;
}