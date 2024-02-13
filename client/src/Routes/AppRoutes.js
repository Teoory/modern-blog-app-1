import React, { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserContext } from '../Hooks/UserContext';
import PrivRoutes from './PrivRoutes';
import DefRoutes from './DefRoutes';
import HomePage from '../Pages/HomePage/HomePage';
import PostPage from '../Pages/PostPage/PostPage';

const AppRoutes = () => {
    const { userInfo } = useContext(UserContext);
    useEffect(() => {
        fetch('https://fiyasko-blog-app.vercel.app/profile', {
            credentials: 'include',
        });
    }, []);
    
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
