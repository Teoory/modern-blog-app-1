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
        fetch('http://localhost:3030/profile', {
            credentials: 'include',
        });
    }, []);
    
    const username = userInfo?.username;

    return (
        <>
            {/* <Routes>
                <Route index element={<HomePage />} />
                <Route path="/post/:id" element={<PostPage/>} />
            </Routes> */}
            
            {username
                ?   <PrivRoutes />
                :   <DefRoutes />
            }
        </>
    );
};

export default AppRoutes;
