import React, { useContext, useEffect, useState } from 'react';
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
    const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(true);


    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (consent === 'true') {
            ReactGA.initialize('G-L90S7CY9N9');
            setIsAnalyticsEnabled(true);
        }
    }, []);

    useEffect(() => {
        if (isAnalyticsEnabled) {
            ReactGA.send({
                hitType: 'pageview',
                page: location.pathname + location.search,
            });
        }
    }, [isAnalyticsEnabled, location.pathname, location.search]);


    // useEffect(() => {
    //     fetch('https://fiyasko-blog-api.vercel.app/profile', {
    //         credentials: 'include'
    //     });
    // }, []);

    
    // ReactGA.initialize("G-JE8SQ0X8QR");
    
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location.pathname]);


    // useEffect(() => {
    //     ReactGA.send({ hitType: "pageview", page: location.pathname });
    // }, [location.pathname]);


    // useEffect(() => {
    //     ReactGA.send({
    //         hitType: "pageview",
    //         page: location.pathname + location.search,
    //     });
    // }, [location.pathname, location.search]);
    
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
