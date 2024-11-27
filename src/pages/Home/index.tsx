import Header from "../../components/Header";
import PostInput from "../../components/PostInput";
import SideMenu from "../../components/SideMenu";
import './style.css';
import Feed from '../../components/Feed';
import { useAuth } from "../../hook/AuthContext";
import { useQuery } from "react-query";
import { handleGetAllPosts } from "../../services/posts";
import Loading from "../../components/Loading";

const Home = () => {
  const { user } = useAuth();
  const { isLoading, error, data: posts } = useQuery(['gig-maker-posts'],
    () => handleGetAllPosts().then(res => {
      return res
    }));
    
  if (isLoading) return <Loading />

  if (error) return <p>Ocorreu um erro:</p>;

  function renderPosts() {
    if (posts) {
      return <Feed posts={posts} />
    }
  }

  return (
    <>
      <Header userId={user?.id || ''} />
      <main className="home container">
        <SideMenu userId={user?.id || ''} />
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