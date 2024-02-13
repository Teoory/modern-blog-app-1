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
    const response = await fetch('https://fiyasko-blog-app.vercel.app/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
    });
    if (response.ok) {
      response.json().then(userInfo => {
        localStorage.setItem('token', userInfo.token);
        console.log(userInfo.token);
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert('Hatalı kullanıcı adı veya şifre!');
    }
  }


  if(redirect) {
    return <Navigate to="/"/>;
  }
  return (
    <div className='loginArea'>
      <form className="login" onSubmit={login}>
        <h1>Giriş Yap</h1>
        <input   type="text"
                placeholder="username" 
                value={username}
                required
                onChange={ev => setUsername(ev.target.value)}/>
        <input  type="password" 
                placeholder="password" 
                value={password}
                required
                onChange={ev => setPassword(ev.target.value)}/>
        <button>Giriş</button>
        <div className='newAccount'>Hesabın yokmu? <Link to="/register">Yeni Hesap Oluştur</Link></div>
      </form>
    </div>
  )
}

export default LoginPage