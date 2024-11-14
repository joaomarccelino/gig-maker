import './style.css';

type GigListCardProps = {
  id: string;
  bandName: string;
  location: string;
  image: string;
}

const GigListCard = ({ id, image, bandName, location }: GigListCardProps) => {
  return (
    <div className='gig-list-card'>
      <img src={image} className='gig-list-image' />
      <p className='band-name'>{bandName}</p>
      <p className="band-location">{location}</p>
      <a href={`/banda/${id}`}>Acessar Perfil</a>
      <a href={`page/banda/${id}`}>Acessar Landing Page</a>
    </div>
  )
}

export default GigListCard;