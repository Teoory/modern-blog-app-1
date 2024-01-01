import React from 'react'
import { Routes, Route } from 'react-router-dom';
import HomePage from '../Pages/HomePage/HomePage';
import NotFoundPage from '../Pages/NotFoundPage/NotFoundPage';
import LoginPage from '../Pages/LoginPage/LoginPage';
import RegisterPage from '../Pages/RegisterPage/RegisterPage';
import CreatePost from '../Pages/CreatePost/CreatePost';
import PostPage from '../Pages/PostPage/PostPage';

const DefRoutes = () => {
  return (
    <Routes>
      <Route index element={<HomePage/>} />
      <Route path="*" element={<NotFoundPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/create" element={<CreatePost/>} />
      <Route path="/post/:id" element={<PostPage/>} />
    </Routes>
  )
}

export default DefRoutes