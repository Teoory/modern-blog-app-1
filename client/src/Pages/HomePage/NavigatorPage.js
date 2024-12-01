import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import Image from '../../components/Image';
import keygame from '../../Images/keygame.png';
import { max } from 'date-fns';

const NavigatorPage = () => {
    // const navData = [
    //     { name: "Bloglar", image: image1, type: 'home' },
    //     { name: "Testler", image: image2, type: 'tests' },
    //     { name: "Oyunlar", image: image3, type: 'games' },
    // ];
//   return (
//     <div>
//         <h1>Kesfet</h1>
//         <div className="navigator-items">
//             {navData.map((system, index) => (
//                 <Link key={index} to={`/${system.type}`} className="system-item">
//                     <div className='system-item-div'>
//                         <img src={system.image} alt={system.name} />
//                         <div className="system-overlay">
//                             <span>{system.name}</span>
//                         </div>
//                     </div>
//                 </Link>
//             ))}
//         </div>
//     </div>
//   )

    const [posts, setPosts] = useState([]);
    const [tests, setTests] = useState([]);
    const [games, setGames] = useState([]);

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
    }, []);

    return (
        <div>
            <div className='areas'>
                <div className="buttonArea">
                    <a href="/home" className="areasTopButton">
                        Bloglar
                    </a>
                    {posts.slice(0, 2).map(post => (
                      <div key={post._id} className="lastPostImageOverlay">
                          <Link to={`/post/${post._id}`} className='BlogTitle'>
                              <Image className="lastPostImage" src={post.cover} alt="img" />
                              <div className="lastPostTitle"><span>{post.title}</span></div>
                          </Link>
                      </div>
                    ))}
                </div>

                <div className="buttonArea">
                    <a href="/tests" className="areasTopButton">
                        Testler
                    </a>
                    {tests.slice(0, 2).map(test => (
                      <div key={test._id} className="lastPostImageOverlay">
                          <Link to={`/tests/${test._id}`} className='BlogTitle'>
                              <Image className="lastPostImage" src={test.cover} alt="img" />
                              <div className="lastPostTitle"><span>{test.title}</span></div>
                          </Link>
                      </div>
                    ))}
                </div>

                <div className="buttonArea">
                    <a href="/games" className="areasTopButton">
                        Oyunlar
                    </a>
                    <div className="lastPostImageOverlay">
                        <Link to="/keygame" className='BlogTitle'>
                            <img src={keygame} alt='img'/>
                            <div className="lastPostTitle"><span>Keygame</span></div>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default NavigatorPage
