import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../Hooks/UserContext';
import { useParams, Navigate, Link } from 'react-router-dom';

const UserProfilePage = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3030/profile/${username}`)
        .then(response => response.json())
        .then(data => setUserProfile(data));
  }, [username]);
  
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3030/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });

  fetch('http://localhost:3030/profilephoto', {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        setProfilePhoto(data);
      })
      .catch(error => console.error('Error fetching profile photo:', error));
    }, []);

    
    useEffect(() => {
      fetch(`http://localhost:3030/profile/${username}`)
        .then(response => response.json())
        .then(data => setUserProfile(data));
    
      fetch(`http://localhost:3030/profile/${username}/likedPosts`)
    .then(response => response.json())
    .then(data => {
      setLikedPosts(data.likedPosts);
      setShowMore(data.likedPosts.length > 6);
    })
    .catch(error => console.error('Error fetching liked posts:', error));
}, [username]);

    if (!userInfo) {
      return <Navigate to="/" replace />;
    }

  async function newProfilePhoto(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append('file', files[0]);
    const response = await fetch('http://localhost:3030/profilePhoto', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  const handleShowMore = () => {
    setShowMore(false);

    setShowAll(true);
  };

  const isFileSelected = files.length > 0;

  if (redirect) {
    window.location.reload();
  }

  if (!userProfile) {
        return <div>Loading...</div>;
  }

  if (!userProfile.user) {
    return <Navigate to="/" replace />;
  }

  const { user, posts } = userProfile;

  return (
    <div className="user-profile-page">
        <div className='ProfilePageMain'>
            <h1>Profil</h1>
            <div className="ProfileCard">
              <div className="ppArea">
                {userInfo.username === username ?
                    <form onSubmit={newProfilePhoto} id="profilePhotoForm">
                      <div className="ppContent">
                        <input  className="ChangePP" type="file" onChange={ev => {setFiles(ev.target.files);}} />
                        {profilePhoto && (
                          <img src={`http://localhost:3030/${user.profilePhoto}`} alt="Profile" />
                          )}
                        </div>
                        {!isFileSelected 
                        ? null
                        : <div className="submit-button">
                            <button style={{ marginTop: '5px' }} disabled={!isFileSelected}>
                                Fotoğrafı Onayla
                            </button>
                          </div>
                        }
                    </form>
                    : <img src={`http://localhost:3030/${user.profilePhoto}`} alt="Profile" />
                }
              </div>
              <div className="infoArea">
                <div className="username">{username}</div>
                <div className="email">{user.email}</div>
                <div className={`tags ${user.tags.join(' ')}`}>{user.tags}</div>
              </div>
            </div>
        </div>
        <div>
          <div className='LastArea'>
            <h2><span>{user.username}</span>'nin Paylaşımları:</h2>
            {posts.length === 0 && <p>Bu kullanıcının henüz bir paylaşımı yok.</p>}
            {posts.length > 0 ? (
              <div className='LastPostImage'>
                  {posts.map(post => (
                  <div key={post._id} className="LastPostImageOverlay">
                      <Link to={`/post/${post._id}`} className='BlogTitle'>
                          <img src={'http://localhost:3030/'+post.cover} alt="img" />
                          <div className='LastPostTitle'>{post.title}</div>
                      </Link>
                      {/* <p className='BlogSummary'>{post.summary}</p> */}
                  </div>
                  ))}
              </div>
            ): (null)}
          </div>

          <hr />
              
          <div className='LastArea'>
            <h2><span>{user.username}</span>'nin Beğendiği Gönderiler:</h2>
            {likedPosts.length > 0 ? (
              <div className='LastPostImage'>
                {likedPosts.slice(0, showAll ? likedPosts.length : 6).map(post => (
                  <div key={post._id} className='LastPostImageOverlay'>
                      <Link to={`/post/${post._id}`} className='BlogTitle'>
                          <img src={'http://localhost:3030/'+post.cover} alt="img" />
                          <div className='LastPostTitle'>{post.title}</div>
                      </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p>{username} henüz hiçbir gönderiyi beğenmedi.</p>
            )}
            {showMore && (
              <button onClick={handleShowMore}>Daha Fazla Göster</button>
            )}
          </div>
        </div>
    </div>
  );
};

export default UserProfilePage