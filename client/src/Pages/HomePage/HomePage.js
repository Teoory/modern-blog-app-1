import Post from '../../components/Post/Post';
import PostAll from '../../components/Post/PostAll';
import TestsAll from '../../components/Tests/Tests';
import { useEffect, useState } from 'react';
// import upImage from '../../Images/upperImage.jpg';
import { API_BASE_URL } from '../../config';
import { Link } from 'react-router-dom';
import keygame from '../../Images/keygame.png';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, SetAvailableTags] = useState([]);
  const [selectedView, setSelectedView] = useState(false);
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
      <h2>Son 3 Gönderi</h2>
      <div className="posts">
        {posts.length > 0 && posts.slice(0,3).map(post => (
          <Post {...post} key={post._id}/>
        ))}
      </div>
      <hr className='homeHR'/> 

      <h2><Link to={'/tests'} style={{textDecoration:'none',color:'var(--color-dark)'}}>Tüm Testler</Link></h2>
      <div className='AllPostsList'>
        {tests.length > 0 && tests.map(test => (
          <TestsAll {...test} key={test._id} />
        ))}
        {tests.length === 0 && <p>Henüz test yok.</p>}
      </div>
      <hr className='homeHR'/>

      
      <h2><Link to={'/games'} style={{textDecoration:'none',color:'var(--color-dark)'}}>Oyunlar</Link></h2>
      <div className='AllPostsList'>
        <div className="lastPostImageOverlay">
            <Link to="/keygame" className='BlogTitle'>
                <img src={keygame} alt='img'/>
                <div className="lastPostTitle"><span>Keygame</span></div>
            </Link>
        </div>
      </div>
      <hr className='homeHR'/>

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