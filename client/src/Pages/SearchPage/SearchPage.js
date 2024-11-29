import { useEffect, useState } from 'react'
import SearchBox from '../../components/Searchbox/SearchBox';
import { Link } from 'react-router-dom';
import Image from '../../components/Image';
import { API_BASE_URL } from '../../config';

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    
    const handleSearch = async (keyword) => {
        try {
            const response = await fetch(`${API_BASE_URL}/search/${keyword}`);
            if (response.ok) {
                const searchData = await response.json();
                setSearchResults(searchData);
            } else {
                console.error('Error searching:', response.statusText);
            }
        } catch (error) {
            console.error('Error searching:', error.message);
        }
    };
    // useEffect(() => {
    //   const element = document.querySelector('.aside');
    //   element.style.display = 'none';
    //   return () => {
    //       if(window.innerWidth > 1280)
    //       element.style.display = 'block';
    //       else if (window.innerWidth <= 1280)
    //       element.style.display = 'contents';
    //   };
    // }, []);

    const [minSearchResults, setMinSearchResults] = useState(0);
    const [maxSearchResults, setMaxSearchResults] = useState(10);
    return (
        <div className='content'>
            <SearchBox onSearch={handleSearch} />
            <div>
                {searchResults.slice(minSearchResults, maxSearchResults).map((result) => (
                    <Link style={{textDecoration: "none"}} to={"/post/"+result._id} key={result._id}>
                        <div className="post">
                            <div className="image">
                                <Image src={result.cover} alt="img" loading='layz' decoding='async' />
                            </div>
                            <div className="text">
                                <span className='PostTagsArea'>{result.PostTags}</span>
                                <h1>{result.title}</h1>
                                <p className="info">
                                    <Link to={"/profile/"+result.author.username} className="author">{result.author.username}</Link>
                                    <time>{result.createdAt}</time>
                                </p>
                                <p className="summary">{result.summary}</p>
                            </div>
                        </div>                        
                    </Link>
                ))}
                {searchResults.length <= 2 
                    ?   null
                    :   <div>
                            <span style={{display:"flex", justifyContent:"center"}}>Görüntülenen paylaşımlar: {minSearchResults} / {maxSearchResults}</span>
                            <div style={{display:"flex", justifyContent:"center", gap:"20px"}}>
                            {minSearchResults === 0 
                                ?   null
                                :   <button style={{width:"min-content", display:"flex", alignItems:"center",gap:"5px", padding:"5px 10px", backgroundColor:"var(--color-info-dark)", fontWeight:"600"}} onClick={() => setMinSearchResults(minSearchResults-10) + setMaxSearchResults(maxSearchResults-10)}><span style={{fontSize:"medium"}}>◀️</span> Önceki Sayfa</button>
                            }
                            {maxSearchResults >= searchResults.length
                                ?   null
                                :   <button style={{width:"min-content", display:"flex", alignItems:"center",gap:"5px", padding:"5px 10px", backgroundColor:"var(--color-info-dark)", fontWeight:"600"}} onClick={() => setMaxSearchResults(maxSearchResults+10) + setMinSearchResults(minSearchResults+10)}>Sonraki Sayfa <span style={{fontSize:"medium"}}>▶️</span></button>
                            }
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default SearchPage