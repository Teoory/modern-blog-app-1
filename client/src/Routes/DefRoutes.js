import React from 'react'
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../Pages/LoginPage/LoginPage';
import RegisterPage from '../Pages/RegisterPage/RegisterPage';
import HomePage from '../Pages/HomePage/HomePage';
import PostPage from '../Pages/PostPage/PostPage';

const DefRoutes = () => {
  return (
    <Routes>
      <Route index path ="/*" element={<HomePage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/post/:id" element={<PostPage/>} />
    </Routes>
  )
}

export default DefRoutes