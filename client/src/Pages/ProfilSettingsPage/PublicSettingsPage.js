import React from 'react'
import { useEffect, useContext, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { UserContext } from '../../Hooks/UserContext';

const ProfilSettingsPage = () => {
    const { setUserInfo, userInfo } = useContext(UserContext);
    const [darkMode, setDarkMode] = useState(true);

    const darkModeToggle = () => {
        if (userInfo === null) {
            setDarkMode(!darkMode);
            return;
        };
        console.log(darkMode);
    };

    
    if (darkMode) {
        document.body.classList.add('dark-mode-variables');
    } else {
        document.body.classList.remove('dark-mode-variables');
    }

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
  

    return (
    <div className='settingsArea'>

        <div className="themaSwitch">
            <div className="dark-mode" onClick={darkModeToggle}>
                <span className={`material-symbols-outlined ${darkMode ? 'active' : ''}`}>
                    light_mode
                </span>
                <span className={`material-symbols-outlined ${darkMode ? '' : 'active'}`}>
                    dark_mode
                </span>
            </div>
        </div>

		<span>Daha fazla ayar görebilmek ve ayarlarınızın kaydedilebilmesi için lütfen giriş yapınız!</span>
        <div className="loginButton">
            <Link to="/login">Login</Link>
        </div>
    </div>
    )
}

export default ProfilSettingsPage