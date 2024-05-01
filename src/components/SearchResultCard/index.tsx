import './style.css';

type SearchResultCardProps = {
  id?: string;
  name: string;
  profilePic: string;
  type: string;
}


const SearchResultCard = ({id, name, profilePic, type}: SearchResultCardProps) => {
  return (
    <div className='search-result-card'>
      <img src={profilePic || ''} alt="" />
      {
        type === 'user' ? <a href={`/user/${id}`}>{name}</a> : <a href={`/banda/${id}`}>{name}</a> 
      }
    </div>
  )
}

export default SearchResultCard;