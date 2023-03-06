import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore"
import { firestore, storage } from "../firebase"
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { User } from "../../hook/AuthContext";
import { useNavigate } from "react-router-dom";

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
