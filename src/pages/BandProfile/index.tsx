import Header from "../../components/Header";
import BandProfileTest from '../../assets/imgs/band-profile-test.png';
import { BiMessage } from 'react-icons/bi';
import './style.css';
import ReferencePlaylist from "../../components/ReferencePlaylist";
import BandMember from "../../components/BandMember";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { handleGetBand } from "../../services/band";
import { useAuth } from "../../hook/AuthContext";



const BandProfile = () => {
  const { id } = useParams();
  const { isLoading, error, data: band } = useQuery(['gigmaker-band-data'],
    () => handleGetBand(id || '').then(res => { console.log(res); return res }));
  console.log(band)
  const { user } = useAuth();
  if (isLoading) return <p>Loading...</p>

  if (error) return <p>Ocorreu um erro:</p>;

  return (
    <>
      <Header userId={user?.id || ''} />
      <main className="band-profile container">
        <div className="band-info">
          <div className="band-cover-photo" style={{ backgroundImage: `url(${BandProfileTest})`, backgroundRepeat: "no-repeat" }}>
            <img src={BandProfileTest} alt="" className="band-prof-photo" />
          </div>
          <h1>{band?.name}</h1>
          <div className="band-menu">
            <button className="icon-btn">
              <BiMessage color="var(--p1)" size={30} />
            </button>
          </div>
        </div>
        {
          band?.repPlaylist && band.refsPlaylist &&
          <div className="band-instruments-refs">
            <div className="band-instruments">
              <h2>Repertório</h2>
              <ReferencePlaylist playlistLink={band?.refsPlaylist} />
            </div>
            <div className="band-references">
              <h2>Referências</h2>
              <ReferencePlaylist playlistLink={band?.repPlaylist} />
            </div>
          </div>
        }

        <section className="members-area">
          <h2>Membros</h2>
          <div className="members">
            {
              band &&
              band.members.map((m) => {
                return (
                  <BandMember
                    key={m.id}
                    memberId={m.id}
                    name={m.name || ''}
                    instruments={m.instruments}
                    memberPicture={m.profilePic || ''}
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
        {/* <Feed posts={feedTest} /> */}
      </main>
    </>
  )
}

export default BandProfile;