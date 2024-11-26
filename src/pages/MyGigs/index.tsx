import Header from "../../components/Header";
import GigListCard from "../../components/GigListCard";
import './style.css'
import { useQuery } from "react-query";
import {handleGetBandsByOwner } from "../../services/band";
import { useAuth } from "../../hook/AuthContext";
const MyGigs = () => {
  const { user } = useAuth();
  const { isLoading, error, data: bands } = useQuery(['gig-maker-owner-bands'],
    () => handleGetBandsByOwner(user?.id || '').then(res => {
      return res
    }));

  if (isLoading) return <p>Loading...</p>

  if (error) return <p>Ocorreu um erro:</p>;

  return (
    <div className="container">
      <Header userId={user?.id || ''} />
      <div className="gig-list">
        {
          bands && bands.map((gig) => {
            return (
              <GigListCard id={gig.id || ''} bandName={gig.name} image={gig.profilePic || ''} location={gig.city} />
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