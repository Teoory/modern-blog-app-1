import Post from '../../components/Post/Post';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('http://192.168.1.3:3030/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <>
      <div className="posts">
        {posts.length > 0 && posts.map(post => (
          <Post {...post} key={post._id}/>
        ))}
      </div>
    </>
  )
}

export default HomePage