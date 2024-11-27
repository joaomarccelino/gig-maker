import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestore, storage } from "../firebase";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Band, Member } from "../../hook/AuthContext";
import { handleGetUser } from "../user";
import { profile } from "console";



type BandRegisterProps = {
  data: Band;
  image: File;
}


export const handleAddBandImage = async (id: string, image: File) => {
  const bandsRef = doc(firestore, "bands", id);
  const imageRef = storageRef(storage, `${id}/${image.name}`);
  uploadBytes(imageRef, image).then(async snapshot => {
    const url = await getDownloadURL(snapshot.ref);
    await updateDoc(bandsRef, {
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
      profilePic: data.profilePic,
      phone: data.phone,
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
        owner: doc.data().owner,
        profilePic: doc.data().profilePic,
        members: doc.data().members
      }
      bandsData.push(snapData);
    })
    return bandsData;
  } catch (error) {
    throw new Error();
  }
}

export const handleGetBandsByOwner = async (ownerId: string) => {
  const dbRef = collection(firestore, "bands");
  const q = query(dbRef, where("owner", "==", ownerId));

  try {
    const querySnapshot = await getDocs(q);
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
        owner: doc.data().owner,
        profilePic: doc.data().profilePic,
        members: doc.data().members
      };
      bandsData.push(snapData);
    });

    return bandsData;
  } catch (error) {
    console.error("Erro ao obter bandas:", error);
    throw new Error("Erro ao obter bandas do proprietário.");
  }
};

export const handleBandUpdate = async (
  id: string,
  updatedData: Band,
  image?: File
) => {
  const bandRef = doc(firestore, "bands", id);

  try {
    if (image) {

      const imageRef = storageRef(storage, `${id}/${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);
      updatedData.profilePic = imageUrl;
    }
    await updateDoc(bandRef, updatedData);
    alert("Dados da banda atualizados com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar dados da banda:", error);
    alert("Erro ao atualizar dados da banda.");
  }
};

const deleteImageFromStorage = async (imageUrl: string) => {
  try {
    const path = imageUrl.split("?")[0].split("o/")[1];
    const imageRef = storageRef(storage, path);
    await deleteObject(imageRef);
  } catch (error) {
  }
};

export const handleDeleteBand = async (bandId: string, profilePicUrl: string) => {
  try {
    if (profilePicUrl) {
      await deleteImageFromStorage(profilePicUrl);
    }
    const bandRef = doc(firestore, "bands", bandId);
    await deleteDoc(bandRef);
    console.log("Banda excluída com sucesso!");

  } catch (error) {
    console.error("Erro ao excluir a banda:", error);
  }
};
