import React, { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserContext } from '../Hooks/UserContext';
import HomePage from '../Pages/HomePage/HomePage';
import PrevievPage from '../Pages/PrevievPage/PrevievPage';
import ProfilePage from '../Pages/ProfilePage/ProfilePage';
import EditPost from '../Pages/EditPost/EditPost';
import CreatePost from '../Pages/CreatePost/CreatePost';
import CreatePrevievPost from '../Pages/CreatePrevievPost/CreatePrevievPost';
import AdminPage from '../Pages/AdminPage/AdminPage';
import PostPage from '../Pages/PostPage/PostPage';
import PrevievPostPage from '../Pages/PrevievPostPage/PrevievPostPage';
import PrevievPostEdit from '../Pages/PrevievPostEdit/PrevievPostEdit';
import CreateTest from '../Pages/CreateTest/CreateTest';
import UserProfilePage from '../Pages/UserProfilePage/UserProfilePage';

const PrivRoutes = () => {
    const { userInfo } = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:3030/profile', {
            credentials: 'include',
        });
    }, []);
    
    const username = userInfo?.username;
    const tags = userInfo?.tags;
    
    const isAdmin = tags?.includes('admin');
    const isEditorUp = tags?.includes('editor') || tags?.includes('moderator') || isAdmin;
    const isMasterWriterUp = tags?.includes('master-writer') || isEditorUp;
    const isWriter = tags?.includes('writer') || isMasterWriterUp;
    // const isUser = tags?.includes('user') || isWriter;

    return (
        <Routes>
            {username 
                ?   <>
                        <Route path="/profile" element={<ProfilePage />} /> 
                        <Route path="/edit/:id" element={<EditPost/>} />
                        <Route path="/post/:id" element={<PostPage/>} />
                        <Route path="/profile/:username" element={<UserProfilePage/>} />
                    </>

                :   <> 
                        <Route path="/post/:id" element={<PostPage/>} />
                        <Route path="/profile/:username" element={<UserProfilePage/>} />
                    </>
            }
            
            {isAdmin
                ?   <Route path="/admin" element={<AdminPage />} />
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