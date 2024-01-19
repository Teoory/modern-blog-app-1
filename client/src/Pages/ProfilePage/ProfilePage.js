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
  const username = userInfo?.username;
  const email = userInfo?.email;
  const tags = userInfo?.tags;

  return (
    <div className='ProfilePageMain'>
        <h1>{username}</h1>
        <div className="ProfileCard">
          <div className="ppArea">
            {profilePhoto && (
              <img className='ProfilePhoto' src={`http://localhost:3030/${profilePhoto}`} alt="Profile" />
            )}
          </div>

          <div className="infoArea">
            <div className="username">{username}</div>
            <div className="email">{email}</div>
            <div className={`tags ${tags.join(' ')}`}>{tags}</div>
          </div>

        </div>
        <form onSubmit={newProfilePhoto}>
        <input type="file" onChange={ev => setFiles(ev.target.files)} />
        {!isFileSelected 
        ? <span style={{ marginTop: '5px' }}>Profil foroğtafı seçilmedi</span>
        : <button style={{ marginTop: '5px' }} disabled={!isFileSelected}>
            Profil fotoğrafı değiştir
          </button>
        }
      </form>
    </div>
  )
}

export default ProfilePage