import Post from '../../components/Post/Post';
import PostAll from '../../components/Post/PostAll';
import { useEffect, useState } from 'react';
import upImage from '../../Images/upperImage.jpg';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, SetAvailableTags] = useState([]);
  const [selectedView, setSelectedView] = useState(false);
  useEffect(() => {
    fetch('https://fiyasko-blog-api.vercel.app/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
    
    fetch('https://fiyasko-blog-api.vercel.app/availableTags')
      .then(response => response.json())
      .then(data => SetAvailableTags(data.availableTags));

  }, []);

  const toogleView = () => {
    setSelectedView(!selectedView);
    console.log(selectedView);
  }
  
  const filterPostsByTags = () => {
    if (selectedTags.length === 0) {
      return posts;
    }
    return posts.filter(post => selectedTags.includes(post.PostTags));
  };
  
  useEffect(() => {
    const element = document.querySelector('.aside');
        if(window.innerWidth > 1280)
        element.style.display = 'block';
        else if (window.innerWidth <= 1280)
        element.style.display = 'contents';
  }, []);

  return (
    <>
      {/* <div className='HeadImage'>
        <img src={upImage} alt="upperImage" decoding='async'/>
      </div>

      
        <hr/> */}
      <h2>Son 3 Gönderi</h2>
      <div className="posts">
        {posts.length > 0 && posts.slice(0,3).map(post => (
          <Post {...post} key={post._id}/>
        ))}
      </div>
        <hr/> 
      <h2>Tüm Gönderiler</h2>
      {/* TAGS */}
      <div className='PostTagArea'>
        <select
          value={selectedTags}
          defaultValue={''}
          onChange={ev => setSelectedTags(Array.from(ev.target.selectedOptions, option => option.value))}
        >
            {availableTags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
        </select>
        <button onClick={() => setSelectedTags([])}>Filtreyi Temizle</button>
      </div>
      <div className="vievButtonArea">
        <button className='ViewButton' onClick={toogleView}>Görünümü değiştir</button>
      </div>
      {/* POSTS */}
      {selectedView ? (
        selectedTags.length > 0 ? (
          filterPostsByTags().length > 0 ? (
            filterPostsByTags().slice(0, 3).map(post => (
              <Post {...post} key={post._id}/>
            ))
          ) : (
            <p>Seçtiğiniz taglara göre gönderi bulunamadı.</p>
          )
        ) : (
          posts.length > 0 && posts.slice(3).map(post => (
            <Post {...post} key={post._id}/>
          ))
        )
        ) : (
          <div className='AllPostsList'>
            {selectedTags.length > 0 ? (
              filterPostsByTags().length > 0 ? (
                filterPostsByTags().slice(0, 3).map(post => (
                  <PostAll {...post} key={post._id}/>
                ))
              ) : (
                <p>Seçtiğiniz taglara göre gönderi bulunamadı.</p>
              )
            ) : (
              posts.length > 0 && posts.slice(3).map(post => (
                <PostAll {...post} key={post._id}/>
              ))
            )}
          </div>
      )}

    </>
  )
}

export default HomePage