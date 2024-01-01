import { Link } from 'react-router-dom'
import { useEffect, useContext } from 'react';
import {UserContext} from '../../Hooks/UserContext';
import './Header.css'

const Header = () => {
  const {setUserInfo, userInfo} = useContext(UserContext);
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
  
  return (
    <header>
    <Link to="/" className="logo">BenimSitem</Link>
    <nav>
      {username ? (
        <>
          <Link to="/create">Create new post</Link>
          <Link to="/profile">{username}</Link>
          <a onClick={logout}>Logout</a>
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