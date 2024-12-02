import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../Hooks/UserContext';
import { useParams, Navigate, Link } from 'react-router-dom';
import Image from '../../components/Image';
import { API_BASE_URL } from '../../config';
import './ProfilePage.css';
import '../AdminPage/AdminPage.css';

const ProfilePage = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const { userInfo } = useContext(UserContext);
  const [likedPosts, setLikedPosts] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/profile/${username}`)
        .then(response => response.json())
        .then(data => setUserProfile(data));
  }, [username]);

  
  useEffect(() => {
      fetch(`${API_BASE_URL}/profile/${username}`)
        .then(response => response.json())
        .then(data => setUserProfile(data));
    
      fetch(`${API_BASE_URL}/profile/${username}/likedPosts`)
    .then(response => response.json())
    .then(data => {
      setLikedPosts(data.likedPosts);
      setShowMore(data.likedPosts.length > 6);
    })
    .catch(error => console.error('Error fetching liked posts:', error));
  }, [username]);
  

  const handleShowMore = () => {
    setShowMore(false);

    setShowAll(true);
  };


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
                <Image src={user.profilePhoto} alt="Profile" />
              </div>
              <div className="infoArea">
                {username === 'admin' || username === 'teory'
                  ? <div className="adminBadge">{username}</div> 
                  : <div className="username">{username}</div>}

                {/* <div className="username">{username}</div> */}
                <div className="email">{user.email}</div>
                {/* <div className={`tags ${user.tags.join(' ')}`}>{user.tags}</div> */}
                <div className={`tags ${user.tags[0]}`}>
                  {user.tags[0]}
                  {user.tags[1] === 'premium' &&(
                  <span className={`premium`}>
                    {" " + "(" + user.tags[1] + ")"}
                  </span>
                  )}
                </div>
              </div>
            </div>
        </div>

        <div className="verifyArea">
          <div className={`verify ${user.isVerified ? 'MailVerified' : 'MailNotVerified'}`}>
            {user.isVerified ? 'E-posta doğrulanmış' : 'E-posta doğrulanmamış'}
          </div>
        </div>

        <div className="bioArea">
          <h2>Biyografi</h2>
          <div className='bioEditArea' style={{width:"80%"}}>
            <textarea disabled="true">
              {(user.bio && user.bio.length) > 0 ? user.bio : 'Bu kullanıcının henüz bir biyografisi yok.'}
            </textarea>
          </div>
        </div>

        <div>
          <div className='LastArea'>
            <h2><span>{user.username}</span> Kullanıcısının Paylaşımları:</h2>
            {posts.length === 0 && <p>Bu kullanıcının henüz bir paylaşımı yok.</p>}
            {posts.length > 0 ? (
              <div className='LastPostImage'>
                  {posts.map(post => (
                  <div key={post._id} className="LastPostImageOverlay">
                      <Link to={`/post/${post._id}`} className='BlogTitle'>
                          <Image src={post.cover} alt="img" />
                          <div className='LastPostTitle'>{post.title}</div>
                      </Link>
                  </div>
                  ))}
              </div>
            ): (null)}
          </div>

          <hr />
              
          <div className='LastArea'>
            <h2><span>{user.username}</span> Kullanıcısının Beğendiği Gönderiler:</h2>
            {likedPosts.length > 0 ? (
              <div className='LastPostImage'>
                {likedPosts.slice(0, showAll ? likedPosts.length : 6).map(post => (
                  <div key={post._id} className='LastPostImageOverlay'>
                      <Link to={`/post/${post._id}`} className='BlogTitle'>
                          <Image src={post.cover} alt="img" />
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

export default ProfilePage