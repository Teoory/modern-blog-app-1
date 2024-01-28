import Post from '../../components/Post/Post';
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
      <div className="posts">
        {posts.length > 0 && posts.map(post => (
          <Post {...post} key={post._id}/>
        ))}
      </div>
    </>
  )
}

export default HomePage