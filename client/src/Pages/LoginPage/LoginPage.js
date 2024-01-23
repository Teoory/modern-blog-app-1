import React from 'react';
import { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../../Hooks/UserContext';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);
  async function login(ev) {
    ev.preventDefault();
    const response = await fetch('http://192.168.1.3:3030/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
    });
    if (response.ok) {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert('Login failed!');
    }
  }


  if(redirect) {
    return <Navigate to="/"/>;
  }
  return (
    <div className='Page'>
      <form className="login" onSubmit={login}>
        <h1>Login</h1>
        <input   type="text"
                placeholder="username" 
                value={username} 
                onChange={ev => setUsername(ev.target.value)}/>
        <input  type="password" 
                placeholder="password" 
                value={password} 
                onChange={ev => setPassword(ev.target.value)}/>
        <Link to="/forgetPassword">Parolami unuttum</Link>
        <button>Login</button>
      </form>
    </div>
  )
}

export default LoginPage