import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Hooks/UserContext';
import { API_BASE_URL } from '../config';

const DarkMode = () => {
    const { userInfo } = useContext(UserContext);
    const [darkMode, setDarkMode] = useState(true);
    
    const GetDarkMode = () => {
        if (userInfo === null) {
            return;
        };
        fetch(`${API_BASE_URL}/darkmode`, {
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setDarkMode(data);
            })
            .catch(error => console.error('Error fetching dark mode:', error));
    };

    useEffect(() => {
        userInfo && GetDarkMode();
    }, [userInfo]);

    useEffect(() => {
        if (userInfo === null) {
            localStorage.getItem('darkMode') === 'true' ? setDarkMode(true) : setDarkMode(false);
        };
    }, [userInfo]);

    if ((userInfo && userInfo.darkMode) || darkMode || localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode-variables');
    } else {
        document.body.classList.remove('dark-mode-variables');
    }
    
    // console.log(userInfo);
    // console.log('DarkMode: ' + darkMode);

    return null;
};

export default DarkMode;