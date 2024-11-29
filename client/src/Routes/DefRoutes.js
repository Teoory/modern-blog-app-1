import React from 'react'
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../Pages/LoginPage/LoginPage';
import RegisterPage from '../Pages/RegisterPage/RegisterPage';
import HomePage from '../Pages/HomePage/HomePage';
import PostPage from '../Pages/PostPage/PostPage';
import ProfilePage from '../Pages/ProfilePage/ProfilePage';
import VerifyPage from '../Pages/RegisterPage/VerifyPage';
import PublicSettingsPage from '../Pages/ProfilSettingsPage/PublicSettingsPage';
import Privacy from '../Pages/PrivacyPage'
import SearchPage from '../Pages/SearchPage/SearchPage';
import NotFoundPage from '../Pages/NotFoundPage/NotFoundPage';
import TestPage from '../Pages/TestPage/TestPage';
import TestDetail from '../Pages/TestPage/TestDetail';

const DefRoutes = () => {
  return (
    <Routes>
      <Route index path ="/" element={<HomePage/>} />
      <Route index path="/home" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/post/:id" element={<PostPage/>} />
      <Route path="/profile/:username" element={<ProfilePage/>} />
      <Route path="/verify-email" element={<VerifyPage/>} />
      <Route path="/settings" element={<PublicSettingsPage/>} />
      <Route path="/notifications" element={<LoginPage />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/tests" element={<TestPage />} />
      <Route path="/tests/:id" element={<TestDetail />} />
    </Routes>
  )
}

export default DefRoutes