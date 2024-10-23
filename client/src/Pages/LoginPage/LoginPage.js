import React, { useEffect } from 'react';
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
    const response = await fetch('https://fiyasko-blog-api.vercel.app/login', {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      credentials: 'include',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({username, password}),
    });
    if (response.ok) {
      response.json().then(userInfo => {
        if (userInfo.token) {
          localStorage.setItem('token', userInfo.token);
        } else {
          alert('Token alınamadı!');
          return;
        }
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert('Hatalı kullanıcı adı veya şifre!');
    }
  }
  useEffect(() => {
    const element = document.querySelector('.aside');
    element.style.display = 'none';
    return () => {
        if(window.innerWidth > 1280)
        element.style.display = 'block';
        else if (window.innerWidth <= 1280)
        element.style.display = 'contents';
    };
  }, []);


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