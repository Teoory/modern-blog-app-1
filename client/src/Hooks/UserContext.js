import { createContext, useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'winter';
    });

    useEffect(() => {
        fetch(`${API_BASE_URL}/profile`, {
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                setUserInfo(data || null);
                setLoading(false);
            })
            .catch(() => {
                setUserInfo(null);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const savedUserInfo = localStorage.getItem('userInfo');
        if (savedUserInfo) {
            setUserInfo(JSON.parse(savedUserInfo));
        } else {
            fetch(`${API_BASE_URL}/profile`, { credentials: 'include' })
                .then(response => response.json())
                .then(data => setUserInfo(data || null));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);
    

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, loading, theme, setTheme }}>
            {children}
        </UserContext.Provider>
    );
}
