import Post from '../../components/Post/Post';
import PostAll from '../../components/Post/PostAll';
import { useEffect, useState } from 'react';
import upImage from '../../Images/upperImage.jpg';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3030/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <>
    <div className='HeadImage'>
      <img src={upImage} alt="upperImage" />
    </div>
      <hr/>
      <h2>Son 3 Gönderi</h2>
      <div className="posts">
        {posts.length > 0 && posts.slice(0,3).map(post => (
          <Post {...post} key={post._id}/>
        ))}
      </div>
      <hr/>
      <h2>Tüm Gönderiler</h2>
      <div className='AllPostsList'>
        {posts.length > 0 && posts.slice(3).map(post => (
          <PostAll {...post} key={post._id}/>
        ))}
      </div>
    </>
  )
}

export default HomePage