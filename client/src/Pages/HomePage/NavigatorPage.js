import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import Image from '../../components/Image';
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
      fetch(`${API_BASE_URL}/post`).then(response => {
        response.json().then(posts => {
          setPosts(posts);
        });
      });
  
      fetch(`${API_BASE_URL}/tests`).then(response => {
        response.json().then(tests => {
          setTests(tests);
        });
      });
    }, []);

    return (
        <div>
            <div style={styles.areas}>
                <div style={styles.buttonArea}>
                    <a href="/home" style={styles.areasTopButton}>
                        Bloglar
                    </a>
                    {posts.slice(0, 3).map(post => (
                      <div key={post._id} style={styles.LastPostImageOverlay} className='LastPostImageOverlay'>
                          <Link to={`/post/${post._id}`} className='BlogTitle'>
                              <Image style={styles.LastPostImage} src={post.cover} alt="img" />
                              <div style={styles.LastPostTitle} className='LastPostTitle'>{post.title}</div>
                          </Link>
                      </div>
                    ))}
                </div>

                <div style={styles.buttonArea}>
                    <a href="/tests" style={styles.areasTopButton}>
                        Testler
                    </a>
                    {tests.slice(0, 3).map(test => (
                      <div key={test._id} style={styles.LastPostImageOverlay} className='LastPostImageOverlay'>
                          <Link to={`/tests/${test._id}`} className='BlogTitle'>
                              <Image style={styles.LastPostImage} src={test.cover} alt="img" />
                              <div style={styles.LastPostTitle} className='LastPostTitle'>{test.title}</div>
                          </Link>
                      </div>
                    ))}
                </div>

                <div style={styles.buttonArea}>
                    <a href="/games" style={styles.areasTopButton}>
                        Oyunlar
                    </a>
                </div>

            </div>
        </div>
    )
}

export default NavigatorPage

const styles = {
    areas: {
        display: 'flex',
        // justifyContent: 'space-between',
        justifyContent: 'space-around',
        gap: '22px',
        marginBottom: '22px'
    },
    buttonImage: {
        width: '200px',
        height: '200px'
    },
    buttonArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '22px',
        alignItems: 'center'
    },
    areasTopButton: {
        backgroundColor: '#303f47',
        border: 'none',
        padding: '10px 20px',
        borderTopRightRadius: '10px',
        borderTopLeftRadius: '10px',
        cursor: 'pointer',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        textDecoration: 'none'
    },
    LastPostImageOverlay: {
        width: '200px',
        height: '200px',
    },
    LastPostImage: {
        maxWidth: '200px',
        maxHeight: '200px',
        margin: '0 auto',
    },
    LastPostTitle: {
        maxWidth: '175px',
        with: '100%',
        maxHeight: '175px',
        height: 'auto',
        overflow: 'hidden',
    }

}