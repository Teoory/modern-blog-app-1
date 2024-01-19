import React, { useEffect, useState } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetch('http://localhost:3030/users', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleChangeTag = (username, newTag) => {
    fetch('http://localhost:3030/changeTag', {
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
    fetch('http://localhost:3030/warning', {
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
      <ul className="AdminUserList">
        {users.map(user => (
          <li key={user.username}>
            <span><span className={`username ${user.tags.join(' ')}`}>{user.username}</span> <span class="tagn">Tag:</span> <span className={`tags ${user.tags.join(' ')}`}>{user.tags.join(', ')}</span></span>
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
      </ul>
      <div className="warning">
        <h3>Warning</h3>
        <form>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" />
          <label htmlFor="message">Message</label>
          <textarea id="message" />
          <button onClick={handleWarning}>Submit</button>
        </form>
        </div>
    </div>
  )
}

export default AdminPage