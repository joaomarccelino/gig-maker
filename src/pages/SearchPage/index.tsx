import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { handleGetUsers } from "../../services/user";
import { handleGetBands } from "../../services/band";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import SearchResultCard from "../../components/SearchResultCard";
import './style.css';

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

  useEffect(() => {
    const filteredResults = searchData?.filter(item =>
      item.name.toLowerCase().includes(searchWord.toLowerCase()));
    filteredResults && setSearchResults(filteredResults)
  }, [searchWord])

  if (isLoading) return <p>Loading...</p>

  if (error) return <p>Ocorreu um erro:</p>;

  return (
    <>
      <Header />
      <main className="search-page container">
        <input type="text" value={searchWord} onChange={(e) => setSearchWord(e.target.value)}/>
        {
          searchResults?.map((item) => {
            return (
              <SearchResultCard id={item.id} name={item.name} profilePic={item.profilePic || ''} type={item.type} />
            )
          })
        }
      </main>

    </>
  )
}

export default SearchPage


