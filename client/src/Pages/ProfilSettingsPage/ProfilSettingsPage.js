import React from 'react'
import { useEffect, useContext, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { UserContext } from '../../Hooks/UserContext';

const ProfilSettingsPage = () => {
    const { setUserInfo, userInfo } = useContext(UserContext);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3030/profile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    const darkModeToggle = () => {
        if (userInfo === null) {
            setDarkMode(!darkMode);
            return;
        };
        fetch('http://localhost:3030/darkmode', {
            credentials: 'include',
            method: 'PUT',
            }).then(() => {
            setDarkMode(!darkMode);
            });
        console.log(darkMode);
    };

    const GetDarkMode = () => {
        if (userInfo === null) {
            return;
        };
        fetch('http://localhost:3030/darkmode', {
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                setDarkMode(data);
            })
            .catch(error => console.error('Error fetching dark mode:', error));
    };

    if (userInfo) {
        GetDarkMode();
    }
    if (darkMode) {
        document.body.classList.remove('dark-mode-variables');
    }
    else {
        document.body.classList.add('dark-mode-variables');
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

        <div className="profil-settings">
            <div className="profil-settings-title">
                Profil Ayarları
            </div>
            <div className="profil-settings-content">
                <div className="SendTicket">
                    <Link to={"/ticketcreate"}>Ticket Oluştur</Link>
                </div>
                <div className="ViewTicket">
                    <Link to={"/ticket"}>Ticketları görüntüle</Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProfilSettingsPage