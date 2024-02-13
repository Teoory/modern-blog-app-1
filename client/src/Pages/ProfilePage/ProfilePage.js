import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../Hooks/UserContext';
import './ProfilePage.css';
import '../AdminPage/AdminPage.css';

const ProfilePage = (ProfilePhoto) => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch('https://fiyasko-blog-app.vercel.app/profile', {
      credentials: 'include',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });

  fetch('https://fiyasko-blog-app.vercel.app/profilephoto', {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        setProfilePhoto(data);
      })
      .catch(error => console.error('Error fetching profile photo:', error));
  }, []);

  async function newProfilePhoto(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append('file', files[0]);
    const response = await fetch('https://fiyasko-blog-app.vercel.app/profilePhoto', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  const isFileSelected = files.length > 0;
  const username = userInfo?.username;
  const email = userInfo?.email;
  const tags = userInfo?.tags;
  const verify = userInfo?.isVerified;

  if (redirect) {
    window.location.reload();
  }

  return (
    <div className='ProfilePageMain'>
        <h1>{username}</h1>
        <div className="ProfileCard">
          <div className="ppArea">
            
            <form onSubmit={newProfilePhoto} id="profilePhotoForm">
              <div className="ppContent">
                <input  className="ChangePP" type="file" onChange={ev => {setFiles(ev.target.files);}} />
                {profilePhoto && (
                  <img src={`https://fiyasko-blog-app.vercel.app/${profilePhoto}`} alt="Profile" />
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
          </div>

          <div className="infoArea">
            <div className="username">{username}</div>
            <div className="email">{email}</div>
            <div className={`tags ${tags.join(' ')}`}>{tags}</div>
          </div>

          <div className="verifyArea">
            <div className="verify">
              {verify ? 'E-posta doğrulanmış' : 'E-posta doğrulanmamış'}
            </div>
          </div>

        </div>
        
    </div>
  )
}

export default ProfilePage