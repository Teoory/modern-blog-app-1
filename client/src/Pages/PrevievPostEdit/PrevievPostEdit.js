import { useState, useEffect } from 'react'
import { Navigate, useParams, Link } from 'react-router-dom';
import Editor from '../../components/Editor/Editor';

const PrevievPostEdit = () => {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch('http://192.168.1.3:3030/previevPost/'+id).then(response => {
            response.json().then(postInfo => {
                setTitle(postInfo.title);
                setSummary(postInfo.summary);
                setContent(postInfo.content);
            });
        });
    }, []);

    async function updatePost(ev) {
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if(files?.[0]) {
            data.set('file', files?.[0]);
        }
        const response = await fetch('http://192.168.1.3:3030/previevPost', {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
        if(response.ok) {
            setRedirect(true);
        }
    }

    if(redirect) {
        return <Navigate to={'/post/'+id}/>
    }

  return (
    <div>
    <div className="EditHeader">Edit Post</div>
    {/* <div className="actions">
        <Link className="delete">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            Delete
        </Link>
    </div> */}

    <form onSubmit={updatePost}>
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
        <button style={{marginTop:'5px'}}>Gönderiyi Güncelle</button>
    </form>
    </div>
  )
}

export default PrevievPostEdit