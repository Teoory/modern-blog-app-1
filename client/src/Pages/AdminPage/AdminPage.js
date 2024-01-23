import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import './AdminPage.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [postCount, setPostCount] = useState('');

  useEffect(() => {
    fetch('http://192.168.1.3:3030/users', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
    
    fetch('http://192.168.1.3:3030/previevPost', {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
        setPostCount(data.length);
    })
    .catch(error => console.error('Error:', error));
  }, []);

  const handleChangeTag = (username, newTag) => {
    fetch('http://192.168.1.3:3030/changeTag', {
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
    fetch('http://192.168.1.3:3030/warning', {
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
      <div className="PrevievShowButton">
        <Link to='/previev'>İnceleme Bloglarını Görüntüle</Link>
        {postCount > 0 && 
          <span className="postCount">{postCount}</span>
        }
      </div>

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


      <div>
        <input
        placeholder="Search User..."
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>


      <table className="AdminUserTable" style={{ maxHeight: '800px', overflowY: 'auto', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Tag</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((user) => (
              <tr key={user.username}>
                <td>
                  <span className={`username ${user.tags.join(' ')}`}>
                    {user.username}
                  </span>
                </td>
                <td>
                  <span className={`tags ${user.tags.join(' ')}`}>
                    {user.tags.join(', ')}
                  </span>
                </td>
                <td>
                  {!user.tags.includes('admin') ? (
                    <div className="tagSelect">
                      <select
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="writer">Writer</option>
                        <option value="master-writer">Master Writer</option>
                        <option value="editor">Editor</option>
                        {user.username === 'teory' && (
                          <option value="moderator">Moderator</option>
                        )}
                      </select>
                      <button
                        onClick={() => handleChangeTag(user.username, newTag)}
                      >
                        Change Tag
                      </button>
                    </div>
                  ) : (
                    <span className="ourAdmin">
                      Not authorized to change tags
                    </span>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>


      {/* <ul className="AdminUserList">
        {users.map(user => (
          <li key={user.username}>
            <span><span className={`username ${user.tags.join(' ')}`}>{user.username}</span> <span className="tagn">Tag:</span> <span className={`tags ${user.tags.join(' ')}`}>{user.tags.join(', ')}</span></span>
            {!user.tags.includes('admin') ? (
              <div className="tagSelect">
                <select
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}>
                  <option value="user">User</option>
                  <option value="writer">Writer</option>
                  <option value="master-writer">Master Writer</option>
                  <option value="editor">Editor</option>
                  {user.username === 'teory'}
                      <option value="moderator">Moderator</option>
                </select>
                <button onClick={() => handleChangeTag(user.username, newTag)}>
                  Change Tag
                </button>
              </div>
            ) : (
              <span className="ourAdmin">Not authorized to change tags</span>
            )}
          </li>
        ))}
      </ul> */}
    </div>
  )
}

export default AdminPage