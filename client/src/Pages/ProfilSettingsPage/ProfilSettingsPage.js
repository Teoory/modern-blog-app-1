import React from 'react'
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../Hooks/UserContext';
import { API_BASE_URL } from '../../config';

const ProfilSettingsPage = () => {
    const { setUserInfo, userInfo } = useContext(UserContext);
    const [darkMode, setDarkMode] = useState(false);
    const [aside, setAside] = useState(false);

    const darkModeToggle = () => {
        localStorage.setItem('darkMode', !darkMode);
        fetch(`${API_BASE_URL}/darkmode`, {
            credentials: 'include',
            method: 'PUT',
            }).then(() => {
            setDarkMode(!darkMode);
            setUserInfo({ ...userInfo, darkMode: !userInfo.darkMode });
            });
        window.location.reload();
    };

    const asideToggle = () => {
        setAside(!aside);
    };

    const GetDarkMode = () => {
        if (userInfo === null) {
            return;
        };
        fetch(`${API_BASE_URL}/darkmode`, {
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                setDarkMode(data);
            })
            .catch(error => console.error('Error fetching dark mode:', error));
    };

    function logout() {
        fetch(`${API_BASE_URL}/logout`, {
          credentials: 'include',
          method: 'POST',
        }).then(() => {
          setUserInfo(null);
        });
    }

    if (userInfo) {
        GetDarkMode();
    }
    
    // useEffect(() => {
    //     const element = document.querySelector('.aside');
    //     element.style.display = 'none';
    //     return () => {
    //         if(window.innerWidth > 1280)
    //         element.style.display = 'block';
    //         else if (window.innerWidth <= 1280)
    //         element.style.display = 'contents';
    //     };
    //   }, []);

    // var asideElement = document.querySelector('.aside');
    // if (aside && asideElement.classList.contains('aside-closed')) {
    //     asideElement.classList.add('aside-closed');
    // } else {
    //     asideElement.classList.remove('aside-closed');
    // }

    return (
    <div className='settingsArea'>
        <div className="themaSwitch">
            <div className="dark-mode" onClick={darkModeToggle}>
                <span className={`material-symbols-outlined ${darkMode ? '' : 'active'}`}>
                    light_mode
                </span>
                <span className={`material-symbols-outlined ${darkMode ? 'active' : ''}`}>
                    dark_mode
                </span>
            </div>
        </div>

        <div className="profil-settings">
            <div className="profil-settings-title">
                Profil Ayarları
            </div>
        <div className="logoutButton">
            <a onClick={logout}>Logout</a>
        </div>

        {/* <div className="asideButton">
            <a onClick={asideToggle}>Aside</a>
        </div> */}

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