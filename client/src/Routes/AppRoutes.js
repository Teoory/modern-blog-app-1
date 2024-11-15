import React, { useContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from "react-ga4";
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

    
    ReactGA.initialize("G-JE8SQ0X8QR");
    
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location.pathname]);


    // useEffect(() => {
    //     ReactGA.send({ hitType: "pageview", page: location.pathname });
    // }, [location.pathname]);


    useEffect(() => {
        ReactGA.send({
            hitType: "pageview",
            page: location.pathname + location.search,
        });
    }, [location.pathname, location.search]);
    
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
