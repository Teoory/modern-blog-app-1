import React, { useContext, useState } from 'react';
import { UserContext } from '../Hooks/UserContext';

const DarkMode = () => {
    const { userInfo } = useContext(UserContext);
    const [darkMode, setDarkMode] = useState(true);
    
    const GetDarkMode = () => {
        if (userInfo === null) {
            return;
        };
        fetch('http://localhost:3030/darkmode', {
            credentials: 'include'
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

    if ((userInfo && userInfo.darkMode) || darkMode) {
        document.body.classList.add('dark-mode-variables');
    } else {
        document.body.classList.remove('dark-mode-variables');
    }
    
    // console.log(userInfo);
    // console.log('DarkMode: ' + darkMode);

    return null;
};

export default DarkMode;