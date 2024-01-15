import React, { useState } from 'react';
import './Warning.css';

const Warning = () => {
    const [isHidden, setIsHidden] = useState(false);

    const toggleVisibility = () => {
        setIsHidden(!isHidden);
    };

    return (
        <>
        {isHidden ? (
            <span></span>
        ) : (
            <a onClick={toggleVisibility}>
            <div className={`warning`}>
                <div className="title">
                    Welcome to the new version of the website!
                </div>
                <div className="message">
                    This is a new version of the website. Please report any bugs you encounter to the admin.
                </div>
            </div></a>
        )}
        </>
    )
}

export default Warning