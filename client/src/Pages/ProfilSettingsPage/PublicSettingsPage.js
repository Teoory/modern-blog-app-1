import React from 'react'
import { useEffect, useContext, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { UserContext } from '../../Hooks/UserContext';

const ProfilSettingsPage = () => {
    const { theme, setTheme } = useContext(UserContext);
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

    const themeToggle = (selectedTheme) => {
        setTheme(selectedTheme);
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
        <div style={{marginBottom: '20px'}}>
            <h3 style={{marginBottom: '15px', fontSize: '1.2rem'}}>Tema Seçimi</h3>
            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px'}}>
                <button 
                    onClick={() => themeToggle('default')}
                    style={{
                        padding: '10px 20px',
                        border: theme === 'default' ? '2px solid #4CAF50' : '2px solid #ccc',
                        borderRadius: '8px',
                        background: theme === 'default' ? '#4CAF50' : 'transparent',
                        color: theme === 'default' ? 'white' : 'inherit',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Varsayılan Tema
                </button>
                <button 
                    onClick={() => themeToggle('winter')}
                    style={{
                        padding: '10px 20px',
                        border: theme === 'winter' ? '2px solid #2196F3' : '2px solid #ccc',
                        borderRadius: '8px',
                        background: theme === 'winter' ? '#2196F3' : 'transparent',
                        color: theme === 'winter' ? 'white' : 'inherit',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Kış Teması ❄️
                </button>
            </div>
        </div>

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