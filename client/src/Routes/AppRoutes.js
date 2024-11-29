import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from "react-ga4";
import { UserContext } from '../Hooks/UserContext';
import PrivRoutes from './PrivRoutes';
import DefRoutes from './DefRoutes';

const AppRoutes = () => {
    const { userInfo, loading } = useContext(UserContext);
    const location = useLocation();

    
    ReactGA.initialize("G-JE8SQ0X8QR");
    
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        ReactGA.send({
            hitType: "pageview",
            page: location.pathname + location.search,
        });
    }, [location.pathname, location.search]);
    
    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <>
            {userInfo?.username ? <PrivRoutes /> : <DefRoutes />}
        </>
    );
};

export default AppRoutes;
