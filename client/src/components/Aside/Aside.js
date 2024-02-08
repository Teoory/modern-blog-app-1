import './Aside.css';
import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

const Aside = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('https://fiyaskoblog-api.vercel.app/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);

  const reloadPage = () => {
    window.reload();
  }

  const getRandomPost = () => {
    const randomIndex = Math.floor(Math.random() * posts.length);
    return posts[randomIndex];
  }

  const mostLikedPost = posts.reduce((Post, currentPost) => {
    const prevTotalLikes = Post.likes.length + (Post.superlikes ? Post.superlikes.length : 0);
    const currentTotalLikes = currentPost.likes.length + (currentPost.superlikes ? currentPost.superlikes.length : 0);
    
    return prevTotalLikes > currentTotalLikes ? Post : currentPost;
  }, posts[0]);
  
  return (
    <div className="aside">
      <div className="aside-title">
        <span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
        </svg>
          En Yeni
        </span>
      </div>
      <div className="aside-content"> 
        <div className="posts">
        {posts.length > 0 && (
          <Link to={`/post/${posts[0]._id}`} onClick={reloadPage}>
              <h3>{posts[0].title}</h3>
          </Link>
        )}
        </div>
      </div>
      
      <div className="aside-title">
        <span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
        </svg>


          En Beğenilen
        </span>
      </div>
      <div className="aside-content"> 
        <div className="posts">
        {posts.length > 0 && (
            <Link to={`/post/${mostLikedPost._id}`} onClick={reloadPage}>
              <h3>{mostLikedPost.title}</h3>
            </Link>
          )}
        </div>
      </div>
      
      <div className="aside-title">
        <span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
        </svg>
          Önerilen
        </span>
      </div>
      <div className="aside-content"> 
        <div className="posts">
          {posts.length > 0 && (
              <Link to={`/post/${getRandomPost()._id}`} onClick={reloadPage}>
                <h3>{getRandomPost().title}</h3>
              </Link>
            )}
        </div>
      </div>

      <Link className='aside-title'>
        <div className="aside-title">
            <Link to={`/ticketCreate`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
              Destek
            </Link>
        </div>
      </Link>

    </div>
  )
}

export default Aside