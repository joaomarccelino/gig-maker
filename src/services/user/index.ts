import { addDoc, collection, doc, updateDoc } from "firebase/firestore"
import { firestore, storage } from "../firebase"
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { User } from "../../hook/AuthContext";

type UserRegisterProps = {
  id: string;
  data: User;
  image: File;
}

export const handleAddUserImage = async(id: string, image: File) => {
  const usersRef = doc(firestore, "users", id);
  const imageRef = storageRef(storage, `${id}/${image.name}`);
  uploadBytes(imageRef, image).then(async snapshot => {
    const url = await getDownloadURL(snapshot.ref);
    await updateDoc(usersRef, {
      profilePic: url
    })
  })
}

export const handleUserRegister = async({id, data, image}: UserRegisterProps) => {
  const usersRef = collection(firestore, "users");
  await addDoc(usersRef, data).then(value => {
    handleAddUserImage(value.path.replace('users/', ''), image);
  })
}