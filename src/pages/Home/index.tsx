import Header from "../../components/Header";
import PostInput from "../../components/PostInput";
import SideMenu from "../../components/SideMenu";
import ProfileTest from '../../assets/imgs/profile-test.png';
import PostExample from '../../assets/imgs/post-example.png';
import './style.css';
import Feed from '../../components/Feed';
import { useAuth } from "../../hook/AuthContext";

const feedTest = [
  {
    id: "ASDASDASD",
    userThumb: ProfileTest,
    userName: "João Lucas Marcelino",
    userInstruments: "Vocal, Guitarra, Violão",
    postPhoto: PostExample,
    postText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor int ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis",
    postComments: [
      {
        userName: "gusesmachado",
        text: "Muito bom meu lindo",
        date: "16/12/1993"
      }
    ]
  },
  {
    id: "sadadasdD",
    userThumb: ProfileTest,
    userName: "João Lucas Marcelino",
    userInstruments: "Vocal, Guitarra, Violão",
    postPhoto: PostExample,
    postText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor int ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis",
    postComments: [
      {
        userName: "gusesmachado",
        text: "Muito bom meu lindo",
        date: "16/12/1993"
      }
    ]
  }
]

const Home = () => {
  const {user} = useAuth();
  return (
    <>
      <Header />
      <main className="home container">
        <SideMenu userId={user.uid}/>
        <div className="home-items">
          <PostInput />
         <Feed  posts={feedTest}  />
        </div>
      </main>
    </>

  )
}

export default Home;