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
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

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
            <h2>{user.username}'nin Blogları:</h2>
            <ul>
                {posts.map(post => (
                <li key={post._id}>
                    <Link to={`/post/${post._id}`} className='BlogTitle'>{post.title}</Link>
                    <p className='BlogSummary'>{post.summary}</p>
                </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default UserProfilePage