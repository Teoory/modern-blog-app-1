import { useContext, useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';
import { UserContext } from '../../Hooks/UserContext';
import '../../QuillSnow.css';

const PostPage = () => {
    const [postInfo, setPostInfo] = useState(null);
    const {userInfo} = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);
    const {id} = useParams();
    useEffect(() => {
        fetch(`http://192.168.1.3:3030/post/${id}`).then(response => {
            response.json().then(postInfo => {
                setPostInfo(postInfo);
            })
        })
}, []);

const deletePost = async () => {
    try {
        const response = await fetch(`http://192.168.1.3:3030/post/${postInfo._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        setRedirect(true);

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error deleting post:', error.message);
    }
};

if(redirect) {
    return <Navigate to={'/'}/>
}

const tags = userInfo?.tags;
const isAdmin = tags?.includes('admin');
const isModerator = tags?.includes('moderator');
const isEditor = tags?.includes('editor');

if (!postInfo) return <div>Loading...</div>
    const locales = { tr, eu };
  return (
    <div className="post-page">
        <h1>{postInfo.title}</h1>
        <time>{format(new Date(postInfo.createdAt), "HH:MM | dd MMMM yyyy", {locale: locales["tr"],})}</time>
        <div className="author">Yazar: @{postInfo.author.username}</div>

        {userInfo === null ? (
            <span></span>
        ) : userInfo.id === postInfo.author._id || isAdmin || isModerator || isEditor ? (
            <div className="actions">
                <Link className="edit" to={`/edit/${postInfo._id}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    Edit
                </Link>
                {isAdmin || isModerator ? (
                <Link className="delete" onClick={() => {
                    if(window.confirm('Bu işlem geri alınamaz. Silmek istediğinize emin misiniz?')) {
                        deletePost();
                    }
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Delete
                </Link>
                ): null}
            </div>
        ) : null}

        <div className="image">
            <img src={'http://192.168.1.3:3030/'+postInfo.cover} alt="img" />
        </div>
        <div className='content' dangerouslySetInnerHTML={{__html:postInfo.content}} />
    </div>
  )
}

export default PostPage