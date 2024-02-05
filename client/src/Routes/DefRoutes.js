import React from 'react'
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../Pages/LoginPage/LoginPage';
import RegisterPage from '../Pages/RegisterPage/RegisterPage';
import HomePage from '../Pages/HomePage/HomePage';
import PostPage from '../Pages/PostPage/PostPage';
// import UserProfilePage from '../Pages/UserProfilePage/UserProfilePage';
import VerifyPage from '../Pages/RegisterPage/VerifyPage';
import PublicSettingsPage from '../Pages/ProfilSettingsPage/PublicSettingsPage';

const DefRoutes = () => {
  return (
    <Routes>
      <Route index path ="/*" element={<HomePage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/post/:id" element={<PostPage/>} />
      <Route path="/profile/:username" element={<LoginPage/>} />
      <Route path="/verify-email" element={<VerifyPage/>} />
      <Route path="/settings" element={<PublicSettingsPage/>} />
    </Routes>
  )
}

export default DefRoutes