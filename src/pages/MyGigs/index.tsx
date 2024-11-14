import Header from "../../components/Header";
import BandPhoto from '../../assets/imgs/band-profile-test.png';
import GigListCard from "../../components/GigListCard";
import './style.css'
import { useQuery } from "react-query";
import { handleGetBands } from "../../services/band";
import { useAuth } from "../../hook/AuthContext";
const MyGigs = () => {
  const { isLoading, error, data: bands } = useQuery(['gig-maker-bands'],
    () => handleGetBands().then(res => {
      return res
    }));
  const { user } = useAuth();

  if (isLoading) return <p>Loading...</p>

  if (error) return <p>Ocorreu um erro:</p>;

  return (
    <div className="container">
      <Header userId={user?.id || ''} />
      <div className="gig-list">
        {
          bands && bands.map((gig) => {
            return (
              <GigListCard id={gig.id || ''} bandName={gig.name} image={BandPhoto} location={gig.city} />
            )
          })

        }
      </div>
      <div className="gig-btn-area">
        <a className="sign-btn" href="/registro-banda">Adicionar GIG</a>
      </div>
    </div>
  )
}

export default MyGigs;