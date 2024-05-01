import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { firestore, storage } from "../firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Band, Member } from "../../hook/AuthContext";
import { handleGetUser } from "../user";



type BandRegisterProps = {
  data: Band;
  image: File;
}


export const handleAddBandImage = async (id: string, image: File) => {
  const usersRef = doc(firestore, "bands", id);
  const imageRef = storageRef(storage, `${id}/${image.name}`);
  uploadBytes(imageRef, image).then(async snapshot => {
    const url = await getDownloadURL(snapshot.ref);
    await updateDoc(usersRef, {
      profilePic: url,
      userThumb: url
    })
  })
}

export const handleBandRegister = async ({data, image} : BandRegisterProps) => {
  try {
    await addDoc(collection(firestore, "bands"), data).then(doc => {
      handleAddBandImage(doc.id, image);
    });
  } catch (error) {
    console.error("Erro ao registrar banda:", error);
  }
};

export const handleGetBand = async (id: string) => {
  const bandRef = doc(firestore, "bands", id);
  const docSnap = await getDoc(bandRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const membersData: Member[] = await Promise.all(
      data.members.map(async (memberDoc: { id: string; }) => {
        const userData = await handleGetUser(memberDoc.id);
        return {
          id: memberDoc.id,
          name: userData.name,
          instruments: userData.instruments,
          profilePic: userData.profilePic
        }
      })
    )
    const bandData = {
      name: data.name,
      district: data.district,
      city: data.city,
      refsPlaylist: data.refsPlaylist,
      repPlaylist: data.repPlaylist,
      about: data.about,
      members: membersData
    }
    return bandData
  }
}

export const handleGetBands = async () => {
  const dbRef = collection(firestore, "bands");
  try {
    const querySnapshot = await getDocs(dbRef);
    let bandsData: Band[] = [];
    querySnapshot.forEach((doc) => {
      const snapData = {
        id: doc.id,
        name: doc.data().name,
        district: doc.data().district,
        city: doc.data().city,
        refsPlaylist: doc.data().refsPlaylist,
        repPlaylist: doc.data().repPlaylist,
        about: doc.data().about,
        type: doc.data().type,
        members: doc.data().members
      }
      bandsData.push(snapData);
    })
    return bandsData;
  } catch (error) {
    throw new Error();
  }
}

