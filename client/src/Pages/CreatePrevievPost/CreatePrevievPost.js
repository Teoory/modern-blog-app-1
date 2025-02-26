import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
// import Editor from "../../components/Editor/Editor";
import CKEditorComponent from "../../components/Editor/CKEditorComponent";
import { API_BASE_URL } from '../../config';

const CreatePrevievPost = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [availableTags, SetAvailableTags] = useState([]);

    useEffect(() => {
      fetch(`${API_BASE_URL}/availableTags`)
        .then(response => response.json())
        .then(data => SetAvailableTags(data.availableTags));
    }, []);

    async function createNewPrevievPost(ev) {
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        data.set('PostTags', selectedTags);
        ev.preventDefault();
        const response = await fetch(`${API_BASE_URL}/previevPost`, {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        }
    }

    if(redirect) {
        return <Navigate to={'/'}/>
    }
  return (
    <>
    <h3 className='warning'>Bu BLOG önizlemeye gönderilecek!</h3>
    <form onSubmit={createNewPrevievPost}>
      <select
        value={selectedTags}
        onChange={ev => setSelectedTags(Array.from(ev.target.selectedOptions, option => option.value))}
      >
          {availableTags.map(tag => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
      </select>
      <input  type="title" 
              placeholder={'Title'} 
              value={title} 
              onChange={ev => setTitle(ev.target.value)}/>

      <input  type="summary" 
              placeholder={'Summary'} 
              maxLength={125}
              value={summary}
              onChange={ev => setSummary(ev.target.value)}/>

      <input  type="file"
              onChange={ev => setFiles(ev.target.files)}/>

      {/* <Editor value={content} onChange={setContent}/> */}
      <CKEditorComponent value={content} onChange={setContent} />
      <button style={{marginTop:'5px'}}>Gönderi oluştur</button>
    </form>
    </>
  )
}

export default CreatePrevievPost