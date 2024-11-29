import React, { useState, useEffect } from 'react';
import './Warning.css';
import { API_BASE_URL } from '../../config';

const Warning = () => {
    const [isHidden, setIsHidden] = useState(false);
    const [warning, setWarning] = useState({});
  
    useEffect(() => {
        fetch(`${API_BASE_URL}/getWarning`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => setWarning(data))
            .catch(error => console.error('Error fetching warning:', error));
        }, []);

    const toggleVisibility = () => {
        setIsHidden(!isHidden);
    };

    return (
        <>
        {isHidden || warning.title === '' ? (
            <span></span>
        ) : (
            <a onClick={toggleVisibility}>
            <div className={`warning`}>
                <div className="title">
                    {warning.title}
                </div>
                <div className="message">
                    {warning.message}
                </div>
            </div></a>
        )}
        </>
    )
}

export default Warning