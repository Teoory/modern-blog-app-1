import React, { useContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { UserContext } from '../Hooks/UserContext';
import PrivRoutes from './PrivRoutes';
import DefRoutes from './DefRoutes';
import HomePage from '../Pages/HomePage/HomePage';
import PostPage from '../Pages/PostPage/PostPage';

const AppRoutes = () => {
    const { userInfo } = useContext(UserContext);
    const location = useLocation();
    useEffect(() => {
        fetch('https://fiyasko-blog-api.vercel.app/profile', {
            credentials: 'include'
        });
    }, []);
    
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location.pathname]);
    
    const username = userInfo?.username;

    return (
        <>
            {username
                ?   <PrivRoutes />
                :   <DefRoutes />
            }
        </>
    );
};

export default AppRoutes;
