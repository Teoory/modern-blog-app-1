import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserContext } from '../Hooks/UserContext';

import HomePage from '../Pages/HomePage/HomePage';
import AdminPage from '../Pages/AdminPage/AdminPage';
import ProfileSettingsPage from '../Pages/ProfilSettingsPage/ProfilSettingsPage';
import NotificationsPage from '../Pages/NotificationsPage/NotificationsPage';
import Privacy from '../Pages/PrivacyPage';
import NavigatorPage from '../Pages/HomePage/NavigatorPage';

import UserProfilePage from '../Pages/UserProfilePage/UserProfilePage';
import PremiumPage from '../Pages/UserProfilePage/PremiumPage';
import PurchasePage from '../Pages/UserProfilePage/PurchasePage';

import PostPage from '../Pages/PostPage/PostPage';
import CreatePost from '../Pages/CreatePost/CreatePost';
import EditPost from '../Pages/EditPost/EditPost';

import PrevievPage from '../Pages/PrevievPage/PrevievPage';
import CreatePrevievPost from '../Pages/CreatePrevievPost/CreatePrevievPost';
import PrevievPostPage from '../Pages/PrevievPostPage/PrevievPostPage';
import PrevievPostEdit from '../Pages/PrevievPostEdit/PrevievPostEdit';

import CreateTestOld from '../Pages/CreateTest/CreateTestOld';
import CreateTest from '../Pages/CreateTest/CreateTest';
import TestPage from '../Pages/TestPage/TestPage';
import TestDetail from '../Pages/TestPage/TestDetail';

import TicketPage from '../Pages/TicketPage/TicketPage';
import TicketCreatePage from '../Pages/TicketCreatePage/TicketCreatePage';
import TicketControlPage from '../Pages/TicketControlPage/TicketControlPage';
import VerifyPage from '../Pages/RegisterPage/VerifyPage';

import Games from '../Pages/GamesPage/GamesPage';
import KeyGame from '../Pages/GamesPage/KeyGame';
import KeyGameAdd from '../Pages/GamesPage/KeyGameAdd';

import SearchPage from '../Pages/SearchPage/SearchPage';

import NotFoundPage from '../Pages/NotFoundPage/NotFoundPage';

import kofuBlog from '../Pages/AppPrivacys/kofuBlog';


const PrivRoutes = () => {
    const { userInfo } = useContext(UserContext);
    
    const tags = userInfo?.tags || [];

    
    const isAdmin = tags?.includes('admin');
    const isEditorUp = tags?.includes('editor') || tags?.includes('moderator') || isAdmin;
    const isPremium = tags?.includes('premium') || isEditorUp;
    const isMasterWriterUp = tags?.includes('master-writer') || isEditorUp;
    const isWriter = tags?.includes('writer') || isMasterWriterUp;

    return (
        <Routes>
            {userInfo && 
            <>
                <Route index path="/" element={<HomePage />} />
                <Route index path="/home" element={<HomePage />} />
                <Route path="/login" element={<HomePage />} />
                <Route path="/register" element={<HomePage />} />
                <Route path="*" element={<NotFoundPage/>} />
                <Route path="/kesfet" element={<NavigatorPage />} />
                <Route path="/tests" element={<TestPage />} />
                <Route path="/tests/:id" element={<TestDetail />} />
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
                <Route path="/search" element={<SearchPage />} />
                <Route path="/games" element={<Games />} />
                <Route path="/keygame" element={<KeyGame />} />
                <Route path="/apps/kofu-blog-privacy" element={<kofuBlog />} />
            </>
            }

            {!isPremium && 
            <>
                <Route path="/premium" element={<PremiumPage />} />
                <Route path="/purchase" element={<PurchasePage />} />
            </>
            }

            {isAdmin &&
            <>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/keygame-add" element={<KeyGameAdd />} />
            </>
            }

            {isEditorUp &&
            <>
                <Route path="/previev" element={<PrevievPage />} />
                <Route path="/previevPost/:id" element={<PrevievPostPage />} />
                <Route path="/previevPostEdit/:id" element={<PrevievPostEdit />} />
            </>
            }

            {isWriter &&
                <Route path="/createPreviev" element={<CreatePrevievPost/>} />
            }

            {isMasterWriterUp &&
            <>
                <Route path="/create" element={<CreatePost/>} />
                <Route path="/createTest" element={<CreateTest/>} />
                <Route path="/createTestOld" element={<CreateTestOld/>} />
            </>
            }
        </Routes>
    )
}

export default PrivRoutes