import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../Hooks/UserContext';
import { useParams, Navigate, Link } from 'react-router-dom';
import Image from '../../components/Image';

const UserProfilePage = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetch(`https://fiyasko-blog-api.vercel.app/profile/${username}`)
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
  const [bio, setBio] = useState('');
  const [editableBio, setEditableBio] = useState(false);

  useEffect(() => {
    fetch('https://fiyasko-blog-api.vercel.app/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });

  fetch('https://fiyasko-blog-api.vercel.app/profilephoto', {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        setProfilePhoto(data);
      })
      .catch(error => console.error('Error fetching profile photo:', error));
  }, []);

  
  useEffect(() => {
      fetch(`https://fiyasko-blog-api.vercel.app/profile/${username}`)
        .then(response => response.json())
        .then(data => setUserProfile(data));
    
      fetch(`https://fiyasko-blog-api.vercel.app/profile/${username}/likedPosts`)
    .then(response => response.json())
    .then(data => {
      setLikedPosts(data.likedPosts);
      setShowMore(data.likedPosts.length > 6);
    })
    .catch(error => console.error('Error fetching liked posts:', error));
  }, [username]);
  
  // useEffect(() => {
  //   const element = document.querySelector('.aside');
  //   element.style.display = 'none';
  //   return () => {
  //       if(window.innerWidth > 1280)
  //       element.style.display = 'block';
  //       else if (window.innerWidth <= 1280)
  //       element.style.display = 'contents';
  //   };
  // }, []);

  if (!userInfo) {
    return <Navigate to="/" replace />;
  }

  async function newProfilePhoto(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append('file', files[0]);
    const response = await fetch('https://fiyasko-blog-api.vercel.app/profilePhoto', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  const handleEditProfileBio = async (ev) => {
    ev.preventDefault();
    try {
      const response = await fetch(`https://fiyasko-blog-api.vercel.app/userBio/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio }),
        credentials: 'include',
      });
      if (response.ok) {
        console.log('Biyografi güncellendi');
        setEditableBio(false);
        window.location.reload();
      } else {
        console.error('Biyografi güncelleme başarısız');
      }
    } catch (error) {
      console.error('Bir hata oluştu:', error.message);
    }
  };
  
  const handleBioChange = (ev) => {
    setBio(ev.target.value);
  };

  

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
                          // <img src={`https://fiyasko-blog-api.vercel.app/${user.profilePhoto}`} alt="Profile" />
                          <Image src={user.profilePhoto} alt="Profile" />
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
                    // : <img src={`https://fiyasko-blog-api.vercel.app/${user.profilePhoto}`} alt="Profile" />
                    : <Image src={user.profilePhoto} alt="Profile" />
                }
              </div>
              <div className="infoArea">
                {username === 'admin' || username === 'teory'
                  ? <div className="adminBadge">{username}</div> 
                  : <div className="username">{username}</div>}

                {/* <div className="username">{username}</div> */}
                <div className="email">{user.email}</div>
                <div className={`tags ${user.tags.join(' ')}`}>{user.tags}</div>
              </div>
            </div>
        </div>

        <div className='dj-center'>
          {(!user.isVerified && userInfo.username === username) ? (<span>E-posta adresinizi doğrulayarak Writer yetkisine terfi alabilirsiniz.</span>) : null}
        </div>

        <div className="verifyArea">
          <div className={`verify ${user.isVerified ? 'MailVerified' : 'MailNotVerified'}`}>
            {user.isVerified ? 'E-posta doğrulanmış' : 'E-posta doğrulanmamış'}
            {userInfo.username === username && !user.isVerified && (
              <Link to="/verify-email" className="verifyLink">
                E-posta doğrulama
              </Link>
            )}
          </div>
        </div>

        <div className="bioArea">
          <h2>Biyografi</h2>
          {userInfo.username === username ? (
            <>
            <button className='bioEditButton' onClick={() => setEditableBio(!editableBio)}>
              {editableBio ? 'Vazgeç' : 'Biyografiyi Düzenle'}
            </button>
            {editableBio && 
            <form onSubmit={handleEditProfileBio}>
              <div>
                <div className='bioEditArea'>
                    <textarea name="bio" onChange={handleBioChange} maxLength={1800} disabled={!editableBio}>
                      {user.bio}
                    </textarea>
                </div>
                <button className='bioApplyButton' disabled={!editableBio}>Biyografiyi Güncelle</button>
              </div>
            </form>
            
            }
            </>
          ) : null}
          {!editableBio && 
            <div className='bioEditArea' style={{width:"80%"}}>
              <textarea disabled="true">
                {(user.bio && user.bio.length) > 0 ? user.bio : 'Bu kullanıcının henüz bir biyografisi yok.'}
              </textarea>
            </div>
          }
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
                          {/* <img src={'https://fiyasko-blog-api.vercel.app/'+post.cover} alt="img" /> */}
                          <Image src={post.cover} alt="img" />
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
            <h2><span>{user.username}</span> Kullanıcısının Beğendiği Gönderiler:</h2>
            {likedPosts.length > 0 ? (
              <div className='LastPostImage'>
                {likedPosts.slice(0, showAll ? likedPosts.length : 6).map(post => (
                  <div key={post._id} className='LastPostImageOverlay'>
                      <Link to={`/post/${post._id}`} className='BlogTitle'>
                          {/* <img src={'https://fiyasko-blog-api.vercel.app/'+post.cover} alt="img" /> */}
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

export default UserProfilePage