import React, { useState } from 'react'

const SearchBox = ({onSearch }) => {
    const [keyword, setKeyword] = useState('');
    const handleSearch = () => {
        onSearch(keyword);
    };
        
    
    return (
        <div style={{display:"flex", height:"100%",marginBottom:"20px", maxHeight:"50px"}}>
            <input 
              type="text" 
              placeholder="Search..." 
              value={keyword} 
              onChange={(e) => setKeyword(e.target.value)} 
              style={{height:"100%", borderRadius:"20px 0 0 20px", border:"none", padding:"0 10px"}}
            />
            <button style={{height:"100%", width:"100%", maxWidth:"120px", borderRadius:"0 20px 20px 0", fontSize:"19px", textAlign:"center", textTransform:"uppercase", color:"white", fontWeight:"900", backgroundColor:"var(--color-info)"}} onClick={handleSearch}>Search</button>
        </div>
    )
};

export default SearchBox