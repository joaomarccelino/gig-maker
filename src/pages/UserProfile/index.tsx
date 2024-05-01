import Header from "../../components/Header";
import PostExample from '../../assets/imgs/post-example.png';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import { HiUserAdd } from 'react-icons/hi';
import './style.css';
import ReferencePlaylist from "../../components/ReferencePlaylist";
import Instrument from "../../components/Instrument";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { handleGetUser } from "../../services/user";

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
              <img src={user.profilePic} alt="" className="user-prof-photo" />
            </div>
            <h1>{user.name}</h1>
            <span className="user-city">{user.city}</span>
            <div className="user-menu">
              <button className="icon-btn">
                <HiUserAdd color="var(--p1)" size={40} />
              </button>
              <a href="https://wa.me/5515991751583?text=Ol%C3%A1%21%20Te%20encontrei%20no%20GIG%20Maker">
                <AiOutlineWhatsApp color="var(--p1)" size={40} />
              </a>
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
          <h1 className="user-btn">Publicações</h1>
          {/* <Feed posts={feedTest} /> */}
        </main>
      </>
    )

  } else {
    return <h1>Algo deu errado</h1>
  }


}

export default UserProfile;