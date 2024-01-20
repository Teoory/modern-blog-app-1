import { Link } from 'react-router-dom'
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../Hooks/UserContext';
import './Header.css';
import logo from './logo.svg';

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3030/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch('http://localhost:3030/logout', {
      credentials: 'include',
      method: 'POST',
    }).then(() => {
      setUserInfo(null);
    });
  }


  const username = userInfo?.username;
  const tags = userInfo?.tags;
    
  const isAdmin = tags?.includes('admin');
  const isEditorUp = tags?.includes('editor') || tags?.includes('moderator') || isAdmin;
  const isMasterWriterUp = tags?.includes('master-writer') || isEditorUp;
  const isWriter = tags?.includes('writer') || isMasterWriterUp;
  const onlyWriter = tags?.includes('writer');
  const isUser = tags?.includes('user') || isWriter;

  return (
    <header>
      <Link to="/" className="logo" ><img alt='logo' className='logo' src={logo}/></Link>
      <nav>
        {username ? (
          <>
          {onlyWriter ? (
            <div className="create-post">
              <Link to="/createPreviev">Create new Previev Post
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </Link>
            </div>
          ) : isMasterWriterUp ? (
            <div className="create-post">
              <Link to="/create">Create new Post
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </Link>
            </div>
          ) : (
            null
          )}
            <div className="dropdown">
              <Link className="dropbtn" onClick={() => setShowDropdown(!showDropdown)}>
                <div className="header-username">
                  {username}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </Link>
              {showDropdown && (
                <div className="dropdown-content">
                  {isAdmin && (
                    <Link to="/admin" className='AdminButton'>Admin</Link>
                  )}
                  <Link to="/profile">Profile</Link>
                  <a onClick={logout}>Logout</a>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}


export default Header