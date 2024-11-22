import { useEffect, useState } from 'react';
import { Instrument } from '../../hook/AuthContext';
import { distanceCalculator } from '../../services/user';
import './style.css';

type SearchResultCardProps = {
  id?: string;
  name: string;
  profilePic: string;
  type: string;
  instruments?: Instrument[];
  city: string;
  userCity: string;
}


const SearchResultCard = ({ id, name, profilePic, type, instruments, city, userCity }: SearchResultCardProps) => {
  const [distance, setDistance] = useState<string | null>(null);
  const userInstruments = instruments?.map(i => i.value).join(', ');

  useEffect(() => {
    const fetchDistance = async () => {
      if (city && userCity) {
        try {
          const calculatedDistance = await distanceCalculator(city, userCity);
          setDistance(calculatedDistance);
        } catch (error) {
          console.error('Erro ao calcular a distância:', error);
          setDistance('Erro ao calcular');
        }
      }
    };

    fetchDistance();
  }, [city, userCity]);

  return (
    <div className='search-result-card'>
      <img src={profilePic || ''} alt="" />
      {
        type === 'user' ? <a href={`/user/${id}`}>{name}</a> : <a href={`/banda/${id}`}>{name}</a>
      }
      {type === 'user' && <div className='search-instruments'><p>Instrumentos: </p><span> {userInstruments}</span></div>}
      <span className='search-city'>{city}</span>
      <span className='search-city'>{distance}km</span>
    </div>
  )
}

export default SearchResultCard;