import { getAdditionalUserInfo, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useContext, createContext, ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../services/firebase";

type Comment = {
  userThumb: string;
  userPic: string;
  text: string;
  date: string;
}

export type Instrument = {
  label: string;
  value: string;
}

export type Post = {
  id: string;
  userThumb: string;
  userName: string;
  userInstruments: string;
  postPhoto?: string;
  postVideoLink?: string;
  postText: string;
  postComments: Comment[];
}

export type User = {
  uid: string;
  name: string;
  profilePic: string;
  coverPic: string;
  userThumb: string;
  district: string;
  city: string;
  spotRef: string;
  instruments: Instrument[];
  about: string;
}

type AuthContextType = {
  user: User;
  handleLogin(): void;
  handleLogout(): void;
}

type AuthContextProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider({ children }: AuthContextProps) {
  const navigate = useNavigate();
  const LOCAL_KEY = '@gig-maker-key'
  const [user, setUser] = useState({} as User);
  const [loading, setLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  async function handleGetUserData(id: string) {
    const userRef = doc(firestore, "users", id);
    try {
      let userData: User = {} as User;
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        userData = {
          uid: data.uid,
          name: data.name,
          profilePic: data.profilePic ,
          coverPic: data.coverPic ,
          userThumb: data.userThumb,
          district: data.district,
          city: data.city,
          spotRef: data.spotRef,
          instruments: data.instruments,
          about: data.about,
        }
        setUser(userData);
        localStorage.setItem(`${LOCAL_KEY}-user`, JSON.stringify(userData));
        navigate('/home');
      } else {
        navigate(`/registro/${userData.uid}`);
      }
    } catch (error) {
      throw new Error(`Erro: ${error}`)
    }
  }

  async function handleCheckLogin() {
    setLoading(true)
    const userData = await JSON.parse(localStorage.getItem(`${LOCAL_KEY}-user`) || '[]');
    if (userData) {
      setUser(userData);
    } else {
      navigate(`/`)
    }
  }

  async function handleLogin() {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const userData = res.user;
      const firstLogin = getAdditionalUserInfo(res)?.isNewUser
      if (firstLogin) {
        navigate(`registro/${userData.uid}`);
      } else {
        handleGetUserData(userData.uid);
      }
    } catch (error) {
      throw new Error(`Erro: ${error}`)
    }
  }

  async function handleLogout() {
    signOut(auth);
    localStorage.removeItem(`${LOCAL_KEY}-user`);
    setUser({} as User);
  }

  useEffect(() => {
    handleCheckLogin();
  }, [])
  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext);
}