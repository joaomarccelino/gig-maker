import Feed from "../../components/Feed";
import Header from "../../components/Header";
import ProfileTest from '../../assets/imgs/profile-test.png';
import PostExample from '../../assets/imgs/post-example.png';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import { BiMessage } from 'react-icons/bi';
import { HiUserAdd } from 'react-icons/hi';
import './style.css';
import ReferencePlaylist from "../../components/ReferencePlaylist";
import Instrument from "../../components/Instrument";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { handleGetUser } from "../../services/user";
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

const instruments = ["Vocal", "Baixo", "Guitarra"]

const UserProfile = () => {
  const { id } = useParams();
  const { isLoading, error, data: user } = useQuery(['gigmaker-user-data'],
    () => handleGetUser(id || '').then(res => { return res }));

  if (isLoading) return <p>Loading...</p>

  if (error) return <p>Ocorreu um erro:</p>;

  if (user) {
    return (
      <>
        <Header />
        <main className="user-profile container">
          <div className="user-info">
            <div className="user-cover-photo" style={{ backgroundImage: `url(${PostExample})`, backgroundRepeat: "no-repeat" }}>
              <img src={ProfileTest} alt="" className="user-prof-photo" />
            </div>
            <h1>{user.name}</h1>
            <span className="user-city">{user.city}, 87km</span>
            <div className="user-menu">
              <button className="icon-btn">
                <HiUserAdd color="var(--p1)" size={40} />
              </button>
              <button className="icon-btn">
                <AiOutlineWhatsApp color="var(--p1)" size={40} />
              </button>
              <button className="icon-btn">
                <BiMessage color="var(--p1)" size={40} />
              </button>
            </div>
          </div>
          <div className="user-instruments-refs">
            <div className="user-instruments">
              <h2>Instrumentos</h2>
              <div className="instruments-area">
                {
                  user.instruments.map((i) => {
                    return (
                      <Instrument instrument={i.value} />
                    )
                  })
                }
              </div>

            </div>
            <div className="user-references">
              <h2>Referências</h2>
              <ReferencePlaylist playlistLink={user.spotRef} />
            </div>
          </div>
          <div className="user-btn-area">
            <button className="user-btn">
              Publicações
            </button>
            <button className="user-btn">
              Vídeos
            </button>
          </div>
          <Feed posts={feedTest} />
        </main>
      </>
    )

  } else {
    return <h1>Algo deu errado</h1>
  }


}

export default UserProfile;