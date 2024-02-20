import React, { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserContext } from '../Hooks/UserContext';

import HomePage from '../Pages/HomePage/HomePage';
import AdminPage from '../Pages/AdminPage/AdminPage';
import ProfilePage from '../Pages/ProfilePage/ProfilePage';
import UserProfilePage from '../Pages/UserProfilePage/UserProfilePage';
import ProfileSettingsPage from '../Pages/ProfilSettingsPage/ProfilSettingsPage';
import NotificationsPage from '../Pages/NotificationsPage/NotificationsPage';
import Privacy from '../Pages/PrivacyPage';

import PostPage from '../Pages/PostPage/PostPage';
import CreatePost from '../Pages/CreatePost/CreatePost';
import EditPost from '../Pages/EditPost/EditPost';

import PrevievPage from '../Pages/PrevievPage/PrevievPage';
import CreatePrevievPost from '../Pages/CreatePrevievPost/CreatePrevievPost';
import PrevievPostPage from '../Pages/PrevievPostPage/PrevievPostPage';
import PrevievPostEdit from '../Pages/PrevievPostEdit/PrevievPostEdit';

import CreateTest from '../Pages/CreateTest/CreateTest';

import TicketPage from '../Pages/TicketPage/TicketPage';
import TicketCreatePage from '../Pages/TicketCreatePage/TicketCreatePage';
import TicketControlPage from '../Pages/TicketControlPage/TicketControlPage';
import VerifyPage from '../Pages/RegisterPage/VerifyPage';

const PrivRoutes = () => {
    const { userInfo } = useContext(UserContext);
    useEffect(() => {
        fetch('https://fiyasko-blog-api.vercel.app/profile', {
            credentials: 'include'
        });
    }, []);
    
    const username = userInfo?.username;
    const tags = userInfo?.tags;
    
    const isAdmin = tags?.includes('admin');
    const isEditorUp = tags?.includes('editor') || tags?.includes('moderator') || isAdmin;
    const isMasterWriterUp = tags?.includes('master-writer') || isEditorUp;
    const isWriter = tags?.includes('writer') || isMasterWriterUp;

    return (
        <Routes>
            {username 
                ?   <>
                        {/* <Route path="/profile" element={<ProfilePage />} />  */}
                        <Route path="/edit/:id" element={<EditPost/>} />
                        <Route path="/post/:id" element={<PostPage/>} />
                        <Route path="/profile/:username" element={<UserProfilePage/>} />
                        <Route path="/ticketCreate" element={<TicketCreatePage/>} />
                        <Route path="/ticket" element={<TicketPage/>} />
                        <Route path="/tickets/:id" element={<TicketControlPage/>} />
                        <Route path="/settings" element={<ProfileSettingsPage />} />
                        <Route path="/verify-email" element={<VerifyPage/>} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/privacy" element={<Privacy />} />
                    </>

                :   <> 
                        <Route path="/post/:id" element={<PostPage/>} />
                        <Route path="/ticketCreate" element={<TicketCreatePage/>} />
                        <Route path="/tickets/:id" element={<TicketControlPage username={username} isAdmin={isAdmin}/>} />
                        <Route path="/settings" element={<ProfileSettingsPage />} />
                        <Route path="/verify-email" element={<VerifyPage/>} />
                        <Route path="/privacy" element={<Privacy />} />
                    </>
            }
            
            {isAdmin
                ?   <>
                        <Route path="/admin" element={<AdminPage />} />
                    </>
                :   null
            }

            {isEditorUp
                ?   <>
                        <Route path="/previev" element={<PrevievPage />} />
                        <Route path="/previevPost/:id" element={<PrevievPostPage />} />
                        <Route path="/previevPostEdit/:id" element={<PrevievPostEdit />} />
                    </>
                :   null
            }

            {isWriter
                ?   <Route path="/createPreviev" element={<CreatePrevievPost/>} />
                :   null
            }

            {isMasterWriterUp
                ?   <>
                        <Route path="/create" element={<CreatePost/>} />
                        <Route path="/createTest" element={<CreateTest/>} />
                    </>
                :   null
            }

            <Route index path="/*" element={<HomePage />} />
        </Routes>
    )
}

export default PrivRoutes