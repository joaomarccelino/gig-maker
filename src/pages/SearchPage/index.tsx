import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { handleGetUsers } from "../../services/user";
import { handleGetBands } from "../../services/band";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import SearchResultCard from "../../components/SearchResultCard";
import './style.css';
import { useAuth } from "../../hook/AuthContext";
import Loading from "../../components/Loading";

const SearchPage = () => {
  const { searchTerm } = useParams();
  const [searchWord, setSearchWord] = useState(searchTerm || '');
  const { isLoading, error, data: searchData } = useQuery(['gigmaker-search-data'], async () => {
    try {
      const usersPromise = handleGetUsers();
      const bandsPromise = handleGetBands();

      const [usersData, bandsData] = await Promise.all([usersPromise, bandsPromise]);
      const usersAndBands = [...usersData, ...bandsData]
      return usersAndBands;
    } catch (error) {
      throw new Error('Erro ao buscar dados');
    }
  });
  const [searchResults, setSearchResults] = useState(searchData);
  const { user } = useAuth();
  useEffect(() => {
    const filteredResults = searchData?.filter(item => {
      if ('instruments' in item) {
        return item.name.toLowerCase().includes(searchWord.toLowerCase()) ||
          item.city.toLowerCase().includes(searchWord.toLowerCase()) ||
          item.instruments.some(instrument => 
            instrument.value.toLowerCase().includes(searchWord.toLowerCase()))           
      } else {
        return item.name.toLowerCase().includes(searchWord.toLowerCase()) || item.city.toLowerCase().includes(searchWord.toLowerCase());
      }
    })
    filteredResults && setSearchResults(filteredResults)
  }, [searchWord, searchData])

  if (isLoading) return <Loading />

  if (error) return <p>Ocorreu um erro:</p>;

  return (
    <>
      <Header userId={user?.id || ''} />
      <main className="search-page container">
        <input className="search-page-input" placeholder="Procure por nome, banda, cidade ou instrumento" type="text" value={searchWord} onChange={(e) => setSearchWord(e.target.value)}/>
        {
          searchResults?.map((item) => {
            return (
              <SearchResultCard id={item.id} name={item.name} profilePic={item.profilePic || ''} type={item.type} instruments={'instruments' in item ? item.instruments : undefined} city={item.city} userCity={user?.city || ''}/>
            )
          })
        }
      </main>

    </>
  )
}

export default SearchPage


