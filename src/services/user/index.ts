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

export const handleUserUpdate = async (
  id: string,
  updatedData: Partial<UserRegisterProps['data']>,
  image?: File
) => {
  const userRef = doc(firestore, "users", id);

  try {
    if (image) {
      const imageRef = storageRef(storage, `${id}/${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);
      updatedData.profilePic = imageUrl;
      updatedData.userThumb = imageUrl;
    }

    await updateDoc(userRef, updatedData);
    alert("Dados do usuário atualizados com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar os dados do usuário:", error);
    alert("Erro ao atualizar os dados do usuário.");
  }
};


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
        id: data.id,
        about: data.about,
        city: data.city,
        coverPic: data.coverPic,
        district: data.district,
        instruments: data.instruments,
        name: data.name,
        profilePic: data.profilePic,
        phone: data.phone,
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

export const getUserById = async (userId: string): Promise<{ name: string; profilePic?: string }> => {
  const userRef = doc(firestore, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as { name: string; profilePic?: string };
  } else {
    throw new Error("Usuário não encontrado");
  }
};

const getCoordinates = async (city: string): Promise<{ lon: number, lat: number }> => {
  const apiKey = process.env.REACT_APP_DISTANCE_KEY;
  const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(city)}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.features && data.features.length > 0) {
      const [lon, lat] = data.features[0].geometry.coordinates;
      return { lon, lat };
    }

    throw new Error('Não foi possível encontrar as coordenadas para a cidade informada.');
  } catch (error) {
    console.error('Erro ao buscar coordenadas:', error);
    throw error;
  }
};





export const distanceCalculator = async (city1: string, city2: string) => {
  const startCoords = await getCoordinates(city1);
  const endCoords = await getCoordinates(city2);

  const apiKey = process.env.REACT_APP_DISTANCE_KEY;
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoords.lon},${startCoords.lat}&end=${endCoords.lon},${endCoords.lat}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (!data.features || data.features.length === 0) {
      throw new Error('Resposta da API inválida.');
    }

    const distance = data.features[0].properties.segments[0].distance; // Distância em metros
    return (distance / 1000).toFixed(2); // Retorna distância em km
  } catch (error) {
    console.error('Erro ao calcular distância:', error);
    throw new Error('Erro ao calcular distância');
  }
};
