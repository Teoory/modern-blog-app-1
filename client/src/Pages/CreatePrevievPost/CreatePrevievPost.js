import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../../components/Editor/Editor";

const CreatePrevievPost = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    async function createNewPrevievPost(ev) {
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        ev.preventDefault();
        const response = await fetch('http://localhost:3030/previevPost', {
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
      <input  type="title" 
              placeholder={'Title'} 
              value={title} 
              onChange={ev => setTitle(ev.target.value)}/>

      <input  type="summary" 
              placeholder={'Summary'} 
              value={summary}
              onChange={ev => setSummary(ev.target.value)}/>

      <input  type="file"
              onChange={ev => setFiles(ev.target.files)}/>

      <Editor value={content} onChange={setContent}/>
      <button style={{marginTop:'5px'}}>Gönderi oluştur</button>
    </form>
    </>
  )
}

export default CreatePrevievPost