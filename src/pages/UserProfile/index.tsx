import Header from "../../components/Header";
import PostExample from '../../assets/imgs/post-example.png';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import { HiUserAdd } from 'react-icons/hi';
import './style.css';
import ReferencePlaylist from "../../components/ReferencePlaylist";
import Instrument from "../../components/Instrument";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { distanceCalculator, handleGetUser } from "../../services/user";
import { useEffect, useState } from "react";
import { useAuth } from "../../hook/AuthContext";
import { handleGetUserPosts } from "../../services/posts";
import Feed from "../../components/Feed";

const UserProfile = () => {
  const [distance, setDistance] = useState<string | null>(null);
  const { user } = useAuth();
  const { id } = useParams();

  const { isLoading, error, data: visitUser } = useQuery(
    ['gigmaker-user-data'],
    () => handleGetUser(id || '').then(res => res)
  );

  const { isLoading: isPostsLoading, error: postsError, data: posts } = useQuery(
    ['gig-maker-user-posts', visitUser?.id],
    () => visitUser?.id ? handleGetUserPosts(visitUser.id) : [],
    {
      enabled: !!visitUser?.id, 
    }
  );



  useEffect(() => {
    const fetchDistance = async () => {
      if (user?.city && visitUser?.city) {
        try {
          const calculatedDistance = await distanceCalculator(user?.city, visitUser?.city);
          setDistance(calculatedDistance);
        } catch (error) {
          console.error('Erro ao calcular a distância:', error);
          setDistance('Erro ao calcular');
        }
      }
    };

    fetchDistance();
  }, [user?.city, visitUser?.city]);

  const renderPosts = () => {
    if (isPostsLoading) {
      return <p>Carregando publicações...</p>;
    }

    if (postsError) {
      return <p>Ocorreu um erro ao carregar as publicações.</p>;
    }

    if (posts && posts.length > 0) {
      return <Feed posts={posts} />;
    } else {
      return <p>Não há publicações para exibir.</p>;
    }
  };

  if (isLoading) return <p>Carregando perfil...</p>;

  if (error) return <p>Ocorreu um erro ao carregar o perfil.</p>;

  if (visitUser) {
    return (
      <>
        <Header userId={visitUser?.id || ''} />
        <main className="user-profile container">
          <div className="user-info">
            <div className="user-cover-photo" style={{ backgroundImage: `url(${PostExample})`, backgroundRepeat: "no-repeat" }}>
              <img src={visitUser.profilePic} alt="" className="user-prof-photo" />
            </div>
            <h1>{visitUser.name}</h1>
            <span className="user-city">{visitUser.city}, {distance}km</span>
            <div className="user-menu">
              <a href="https://wa.me/5515991751583?text=Ol%C3%A1%21%20Te%20encontrei%20no%20GIG%20Maker">
                <AiOutlineWhatsApp color="var(--p1)" size={40} />
              </a>
            </div>
          </div>
          <div className="user-instruments-refs">
            <div className="user-instruments">
              <h2>Instrumentos</h2>
              <div className="instruments-area">
                {visitUser.instruments.map((i, index) => (
                  <Instrument key={index} instrument={i.value} />
                ))}
              </div>
            </div>
            <div className="user-references">
              <h2>Referências</h2>
              <ReferencePlaylist playlistLink={visitUser.spotRef} />
            </div>
          </div>
          <h1 className="user-btn">Publicações</h1>
          {renderPosts()}
        </main>
      </>
    );
  } else {
    return <h1>Algo deu errado ao carregar os dados do usuário.</h1>;
  }
};

export default UserProfile;
