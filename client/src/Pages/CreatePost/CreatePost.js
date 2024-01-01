import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";

const modules = {
  toolbar: [
    [{ 'font': [] }],
    [{ 'header': [1, 2, 3, 4, false] }],

    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }, {'indent': '-1'}, {'indent': '+1'}],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'image']
  ]
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    ev.preventDefault();
    const response = await fetch('http://localhost:3030/post', {
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
    <form onSubmit={createNewPost}>
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

      <ReactQuill theme="snow" 
                  value={content} 
                  onChange={newValue => setContent(newValue)} 
                  modules={modules}
                  formats={formats}/>
      <button style={{marginTop:'5px'}}>Gönderi oluştur</button>
    </form>
  )
}

export default CreatePost