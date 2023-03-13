import Header from "../../components/Header";
import PostInput from "../../components/PostInput";
import SideMenu from "../../components/SideMenu";
import './style.css';
import Feed from '../../components/Feed';
import { useAuth } from "../../hook/AuthContext";
import { useQuery } from "react-query";
import { handleGetAllPosts } from "../../services/posts";

const teste = [
  {
    id: '',
    userThumb: '',
    userName: '',
    userInstruments: '',
    postPhoto: '',
    postVideoLink: '',
    postText: '',
    postComments: []
  }
]

const Home = () => {
  const { user } = useAuth();
  const { isLoading, error, data: posts } = useQuery(['gig-maker-posts'],
    () => handleGetAllPosts().then(res => {
      console.log(res)
      return res
    }));
  if (isLoading) return <p>Loading...</p>

  if (error) return <p>Ocorreu um erro:</p>;

  function renderPosts() {
    if (posts) {
      console.log(posts)
      return <Feed posts={posts} />
    }
  }

  return (
    <>
      <Header />
      <main className="home container">
        <SideMenu userId={user.uid} />
        <div className="home-items">
          <PostInput />
          {
            renderPosts()
          }
        </div>
      </main>
    </>

  )
}

export default Home;