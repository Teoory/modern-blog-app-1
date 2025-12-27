import Post from '../../components/Post/Post';
import PostAll from '../../components/Post/PostAll';
import TestsAll from '../../components/Tests/Tests';
import BlogSlider from '../../components/Slider/Slider';
import { useEffect, useState } from 'react';
// import upImage from '../../Images/upperImage.jpg';
import { API_BASE_URL } from '../../config';
import { Link } from 'react-router-dom';
import keygame from '../../Images/keygame.png';
import { useContext } from 'react';
import { UserContext } from '../../Hooks/UserContext';

import snowBell from '../../Images/bells.png';
import giftBox from '../../Images/gift-box.png';
import miniTree from '../../Images/mini-tree.png';
import santaHat from '../../Images/santa-hat.png';
import christmasDivider from '../../Images/christmas-divider.png';

const HomePage = () => {
  const { theme } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, SetAvailableTags] = useState([]);
  const [selectedView, setSelectedView] = useState(false);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE_URL}/homePosts`).then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });

    fetch(`${API_BASE_URL}/homeTests`).then(response => {
      response.json().then(tests => {
        setTests(tests);
      });
    });

    fetch(`${API_BASE_URL}/featured-posts`)
      .then((res) => res.json())
      .then((data) => setFeaturedPosts(data))
      .catch((error) => console.error('Error fetching featured posts:', error));
    
    fetch(`${API_BASE_URL}/availableTags`)
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

  return (
    <>
      {/* <div className='HeadImage'>
        <img src={upImage} alt="upperImage" decoding='async'/>
      </div>

      
        <hr/> */}
      <h1 style={{textAlign:'center',color:'var(--color-dark-varient)',margin:0}}>Merhaba, Kofu Blog'a Hoşgeldiniz!</h1>
      
      <div style={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
        { theme === 'winter' && (
          <div className='winterDecorations'>
            <img src={miniTree} alt="miniTree" className='giftBoxDecoration'/>
            <img src={christmasDivider} alt="christmasDivider" className='snowBellDecoration'/>
            <img src={santaHat} alt="santaHat" className='snowBellDecoration'/>
            <img src={christmasDivider} alt="christmasDivider" className='snowBellDecoration'/>
            <img src={miniTree} alt="miniTree" className='giftBoxDecoration'/>
          </div>
        )}
      </div>
      
      <BlogSlider featuredPosts={featuredPosts} />

      <h2>Son 3 Gönderi</h2>
      <div className="posts">
        {posts.length > 0 && posts.slice(0,3).map(post => (
          <Post {...post} key={post._id}/>
        ))}
      </div>
      
      <div style={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
        { theme === 'winter' && (
          <div className='winterDecorations'>
            <img src={snowBell} alt="snowBell" className='snowBellDecoration'/>
            <img src={giftBox} alt="giftBox" className='giftBoxDecoration'/>
          </div>
        )}
        <hr className='homeHR'/>
        { theme === 'winter' && (
          <div className='winterDecorations'>
            <img src={giftBox} alt="giftBox" className='giftBoxDecoration'/>
            <img src={snowBell} alt="snowBell" className='snowBellDecoration'/>
          </div>
        )}
      </div>

      <h2><Link to={'/tests'} style={{textDecoration:'none',color:'var(--color-dark)'}}>Tüm Testler</Link></h2>
      <div className='AllPostsList'>
        {tests.length > 0 && tests.map(test => (
          <TestsAll {...test} key={test._id} />
        ))}
        {tests.length === 0 && <p>Henüz test yok.</p>}
      </div>
      <div style={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
        { theme === 'winter' && (
          <div className='winterDecorations'>
            <img src={snowBell} alt="snowBell" className='snowBellDecoration'/>
            <img src={giftBox} alt="giftBox" className='giftBoxDecoration'/>
          </div>
        )}
        <hr className='homeHR'/>
        { theme === 'winter' && (
          <div className='winterDecorations'>
            <img src={giftBox} alt="giftBox" className='giftBoxDecoration'/>
            <img src={snowBell} alt="snowBell" className='snowBellDecoration'/>
          </div>
        )}
      </div>

      
      <h2><Link to={'/games'} style={{textDecoration:'none',color:'var(--color-dark)'}}>Oyunlar</Link></h2>
      <div className='AllPostsList'>
        <div className="lastPostImageOverlay">
            <Link to="/keygame" className='BlogTitle'>
                <img src={keygame} className='lastPostImageGame' alt='img'/>
                <div className="lastPostTitle"><span>Keygame</span></div>
            </Link>
        </div>
      </div>
      <div style={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
        { theme === 'winter' && (
          <div className='winterDecorations'>
            <img src={snowBell} alt="snowBell" className='snowBellDecoration'/>
            <img src={giftBox} alt="giftBox" className='giftBoxDecoration'/>
          </div>
        )}
        <hr className='homeHR'/>
        { theme === 'winter' && (
          <div className='winterDecorations'>
            <img src={giftBox} alt="giftBox" className='giftBoxDecoration'/>
            <img src={snowBell} alt="snowBell" className='snowBellDecoration'/>
          </div>
        )}
      </div>

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
      
      <div style={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
        { theme === 'winter' && (
          <div className='winterDecorations'>
            <img src={miniTree} alt="miniTree" className='giftBoxDecoration'/>
            <img src={christmasDivider} alt="christmasDivider" className='snowBellDecoration'/>
            <img src={santaHat} alt="santaHat" className='snowBellDecoration'/>
            <img src={christmasDivider} alt="christmasDivider" className='snowBellDecoration'/>
            <img src={miniTree} alt="miniTree" className='giftBoxDecoration'/>
          </div>
        )}
      </div>

    </>
  )
}

export default HomePage