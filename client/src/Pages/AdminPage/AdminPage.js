import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import './AdminPage.css';
import { API_BASE_URL } from '../../config';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [postCount, setPostCount] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
    
    fetch(`${API_BASE_URL}/previevPost`, {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => { setPostCount(data.length); })
    .catch(error => console.error('Error:', error));
  }, []);

  const handleChangeTag = (username, newTag) => {
    fetch(`${API_BASE_URL}/changeTag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, newTag }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Tag changed successfully:', data);
        setUsers(prevUsers => {
          const updatedUsers = prevUsers.map(user =>
            user.username === username ? { ...user, tags: [newTag] } : user
          );
          return updatedUsers;
        });
      })
      .catch(error => console.error('Error changing tag:', error));
  };

  function handleWarning(ev) {
    ev.preventDefault();
    const title = document.getElementById('title').value;
    const message = document.getElementById('message').value;
    fetch(`${API_BASE_URL}/warning`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ title, message }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Warning sent successfully:', data);
        alert('Warning sent successfully');
      })
      .catch(error => console.error('Error sending warning:', error));
  }

  return (
    <div>
      <div className="admin-page">
        <h1 style={{color:'var(--color-primary)',textAlign:'center',textTransform:'uppercase',margin:'0'}}>Admin Dashboard</h1>
        
      <div className="warning-edit-area">
        <div className="warning-inside">
          <h3>Warning</h3>
          <form>
            <input type="text" placeholder="Title..." id="title" />
            <textarea placeholder="Message..." id="message" />
            <button onClick={handleWarning}>Submit</button>
          </form>
        </div>
      </div>
        
      <div className="PrevievShowButton">
        <Link to='/previev'>İnceleme Bloglarını Görüntüle</Link>
        {postCount > 0 && 
          <span className="postCount">{postCount}</span>
        }
      </div>
      <div>
        <input
        placeholder="Search User..."
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Tag</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(user => (
              <tr key={user.username}>
                <td><Link to={`/profile/${user.username}`} className={`username ${user.userColor}`} style={{textDecoration:'none'}}>{user.username}</Link></td>
                <td className={`tags ${user.tags[0]}`}>
                  {user.tags[0]} 
                  {user.tags[1] && 
                    <span className={`${user.tags[1]}`} style={{marginLeft:'5px'}}>
                      {user.tags[1]}
                    </span>
                  }
                </td>
                <td>
                  {!user.tags.includes('admin') ? (
                    <div className="tag-actions">
                      <select
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="writer">Writer</option>
                        <option value="master-writer">Master Writer</option>
                        <option value="editor">Editor</option>
                        {user.username === 'teory' && <option value="moderator">Moderator</option>}
                      </select>
                      <div style={{display:'flex',gap:'10px'}}>
                        <button onClick={() => handleChangeTag(user.username, newTag)} className="btn-primary">Change</button>
                        <button style={{backgroundColor:'var(--color-danger)',color:'#fff',textTransform:'uppercase'}}>BAN</button>
                      </div>
                    </div>
                  ) : <span className="ourAdmin">Not Authorized</span>}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default AdminPage