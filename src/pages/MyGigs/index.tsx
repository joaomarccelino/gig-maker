import Header from "../../components/Header";
import BandPhoto from '../../assets/imgs/band-profile-test.png';
import GigListCard from "../../components/GigListCard";
import './style.css'
import { useQuery } from "react-query";
import { handleGetBands } from "../../services/band";
const MyGigs = () => {
  const { isLoading, error, data: bands } = useQuery(['gig-maker-bands'],
    () => handleGetBands().then(res => {
      return res
    }));

  if (isLoading) return <p>Loading...</p>

  if (error) return <p>Ocorreu um erro:</p>;


  const GigsTest = [
    {
      id: '123',
      bandName: 'PERDIDOS',
      image: BandPhoto,
      location: "São Miguel Arcanjo/SP"
    },
    {
      id: '456',
      bandName: 'Azul Pitanga',
      image: BandPhoto,
      location: "Tatuí/SP"
    },
    {
      id: '123',
      bandName: 'PERDIDOS',
      image: BandPhoto,
      location: "São Miguel Arcanjo/SP"
    },
  ]

  return (
    <div className="container">
      <Header />
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