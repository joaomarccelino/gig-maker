import Feed from "../../components/Feed";
import Header from "../../components/Header";
import ProfileTest from '../../assets/imgs/profile-test.png';
import BandProfileTest from '../../assets/imgs/band-profile-test.png';
import PostExample from '../../assets/imgs/post-example.png';
import { BiMessage } from 'react-icons/bi';
import { HiUserAdd } from 'react-icons/hi';
import './style.css';
import ReferencePlaylist from "../../components/ReferencePlaylist";
import BandMember from "../../components/BandMember";
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

const members = [
  {
    memberPicture: ProfileTest,
    memberId: '123',
    name: 'João Lucas',
    instruments: ["Vocal", "Baixo"]
  },
  {
    memberPicture: ProfileTest,
    memberId: '124',
    name: 'Antonio Estevam',
    instruments: ["Cavaco"]
  },
  {
    memberPicture: ProfileTest,
    memberId: '125',
    name: 'Anderson Sabbath',
    instruments: ["Percussão"]
  },
  {
    memberPicture: ProfileTest,
    memberId: '126',
    name: 'João Auro',
    instruments: ["Bateria"]
  },
  {
    memberPicture: ProfileTest,
    memberId: '127',
    name: 'Gustavo Machado',
    instruments: ["Guitarra"]
  }
]


const BandProfile = () => {
  return (
    <>
      <Header />
      <main className="band-profile container">
        <div className="band-info">
          <div className="band-cover-photo" style={{ backgroundImage: `url(${BandProfileTest})`, backgroundRepeat: "no-repeat" }}>
            <img src={BandProfileTest} alt="" className="band-prof-photo" />
          </div>
          <h1>Perdidos</h1>
          <div className="band-menu">
            <button className="icon-btn">
              <HiUserAdd color="var(--p1)" size={40} />
            </button>
            <button className="icon-btn follow-btn">
              SEGUIR
            </button>
            <button className="icon-btn">
              <BiMessage color="var(--p1)" size={40} />
            </button>
          </div>
        </div>
        <div className="band-instruments-refs">
          <div className="band-instruments">
            <h2>Repertório</h2>
            <ReferencePlaylist playlistLink="https://open.spotify.com/playlist/0g2SdpJq60wfbLtphZuRtr?si=51773b6884124519" />
          </div>
          <div className="band-references">
            <h2>Referências</h2>
            <ReferencePlaylist playlistLink="https://open.spotify.com/playlist/5mdiOU0MVBpTWEVwUy2YOq?si=3bc1225f95cd49b4" />
          </div>
        </div>
        <section className="members-area">
          <h2>Membros</h2>
          <div className="members">
            {
              members.map((m) => {
                return (
                  <BandMember 
                  key={m.memberId}
                  memberId={m.memberId}
                  name={m.name} 
                  instruments={m.instruments}
                  memberPicture={m.memberPicture}
                  />
                )
              })
            }
          </div>
        </section>
        <div className="band-btn-area">
          <button className="band-btn">
            Publicações
          </button>
          <button className="band-btn">
            Vídeos
          </button>
        </div>
        <Feed posts={feedTest} />
      </main>
    </>
  )
}

export default BandProfile;