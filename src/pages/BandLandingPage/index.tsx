import { useParams } from 'react-router-dom';
import ReferencePlaylist from '../../components/ReferencePlaylist';
import BandProfileTest from '../../assets/imgs/band-profile-test.png';
import './style.css';
import { useQuery } from 'react-query';
import { handleGetBand } from '../../services/band';
import LpHeader from '../../components/LpHeader';
import Loading from '../../components/Loading';

const BandLandingPage = () => {

  const { id } = useParams();
  const { isLoading, error, data: band } = useQuery(['gigmaker-band-data-lp'],
    () => handleGetBand(id || '').then(res => { return res }));

  if (isLoading) return <Loading />

  if (error) return <p>Ocorreu um erro:</p>;


  return (
    <div>
      <LpHeader bandName={band?.name} />
      <section className="container about-lp" id='about'>
        <div className="about-lp-text">
          <h1>A banda</h1>
          <p>{band?.about}</p>
          <a href="https://wa.me/5515991751583?text=Ol%C3%A1%21%20Te%20encontrei%20no%20GIG%20Maker" className="sign-btn">
            FAÇA UM ORÇAMENTO
          </a >
        </div>
        <div className='about-lp-img'>
          <img src={band?.profilePic} alt="" />
        </div>
      </section>
      <section className="container">
        <h2 className='band-lp-setlist-title' id='setlist'>O que tocamos</h2>
        <div className="lp-rep-refs">
          <div className="band-instruments">
            <h2>Repertório</h2>
            <ReferencePlaylist playlistLink={"https://open.spotify.com/playlist/0JDhkhpJrEpDt6Sh0J9QfG"
            } />
          </div>
          <div className="band-references">
            <h2>Referências</h2>
            <ReferencePlaylist playlistLink={"https://open.spotify.com/playlist/0JDhkhpJrEpDt6Sh0J9QfG"
            } />
          </div>
        </div>

      </section>
    </div>
  )
}

export default BandLandingPage;