import React, { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserContext } from '../Hooks/UserContext';
import HomePage from '../Pages/HomePage/HomePage';
import ProfilePage from '../Pages/ProfilePage/ProfilePage';
import EditPost from '../Pages/EditPost/EditPost';
import CreatePost from '../Pages/CreatePost/CreatePost';
import AdminPage from '../Pages/AdminPage/AdminPage';
import PostPage from '../Pages/PostPage/PostPage';

const PrivRoutes = () => {
    const { userInfo } = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:3030/profile', {
            credentials: 'include',
        });
    }, []);
    
    const username = userInfo?.username;
    return (
        <Routes>
            {username 
                ?   <>
                        <Route path="/profile" element={<ProfilePage />} /> 
                        <Route path="/edit/:id" element={<EditPost/>} />
                        <Route path="/create" element={<CreatePost/>} />
                        <Route path="/post/:id" element={<PostPage/>} />
                    </>

                :   <> 
                        <Route path="/post/:id" element={<PostPage/>} />
                    </>
            }
            
            {username === "admin"
                ?   <Route path="/admin" element={<AdminPage />} />
                :   <>  </>
            }

            <Route index path="/*" element={<HomePage />} />
        </Routes>
    )
}

export default PrivRoutes