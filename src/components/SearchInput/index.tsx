  import { InputHTMLAttributes, forwardRef, useEffect, useState } from "react";
  import { useQuery } from "react-query";
  import { handleGetUsers } from "../../services/user";
  import { User } from "../../hook/AuthContext";
  import './style.css';

  interface SearchResult {
    id: string;
    name: string;
  }



  interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> { }

  const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
    const [userName, setUserName] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [results, setResults] = useState<SearchResult[]>([]);

    const { isLoading, error, data: users } = useQuery(['gig-maker-posts'],
      () => handleGetUsers().then(res => {
        return res
      }));

    const handleGetSearchResults = (searchTerm: string, users: User[]): SearchResult[] => {
      const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const searchResults: SearchResult[] = filteredUsers.map(user => ({
        id: user.id,
        name: user.name,
      }));

      return searchResults;
    }

    useEffect(() => {
      const fetchData = async () => {
        if (users) {
          const searchResults = await handleGetSearchResults(searchTerm, users);
          setResults(searchResults);
        }
      };

      fetchData();
    }, [searchTerm, users]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };

    useEffect(() => {
    }, [searchTerm]);

    const handleSelectMusician = (id: string, name: string) => {
      setUserName(name)
      setSearchTerm(id)
      setResults([]);
    }
    
    if (isLoading) return <p>Loading...</p>

    if (error) return <p>Ocorreu um erro:</p>;



    
    return (
      <div>
        <label htmlFor="member-name">Pesquisar Membro</label>
        <input
          {...props}
          ref={ref}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Digite o nome..."
        />

        {searchTerm && results.length > 0 && (
          <ul className="search-result">
            {results.map(item => (
              <li key={item.id}>
                <button className="icon-btn" onClick={() => handleSelectMusician(item.id, item.name)}>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        <label htmlFor="member-name">Nome: </label>
        <span className="member-name">{userName}</span>
      </div>
    );
  });

  export default SearchInput;