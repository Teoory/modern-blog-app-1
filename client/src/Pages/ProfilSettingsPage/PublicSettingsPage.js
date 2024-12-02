import React from 'react'
import { useEffect, useContext, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { UserContext } from '../../Hooks/UserContext';

const ProfilSettingsPage = () => {
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode) {
            setDarkMode(JSON.parse(savedDarkMode));
        }
    }, []);

    const darkModeToggle = () => {
        localStorage.setItem('darkMode', !darkMode);
        setDarkMode(!darkMode);
    };
    
    if (darkMode) {
        document.body.classList.add('dark-mode-variables');
    } else {
        document.body.classList.remove('dark-mode-variables');
    }

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