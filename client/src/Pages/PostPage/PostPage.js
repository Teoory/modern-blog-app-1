import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';
import { UserContext } from '../../Hooks/UserContext';

const PostPage = () => {
    const [postInfo, setPostInfo] = useState(null);
    const {userInfo} = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);
    const {id} = useParams();
    useEffect(() => {
        fetch(`http://localhost:3030/post/${id}`).then(response => {
            response.json().then(postInfo => {
                setPostInfo(postInfo);                
            })
        })
}, []);

async function deletePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('id', id);
    const response = await fetch('http://localhost:3030/post', {
        method: 'DELETE',
        body: data,
        credentials: 'include',
    });
    if(response.ok) {
        setRedirect(true);
    }
}


if (!postInfo) return <div>Loading...</div>
    const locales = { tr, eu };
  return (
    <div className="post-page">
        <h1>{postInfo.title}</h1>
        <time>{format(new Date(postInfo.createdAt), "HH:MM | dd MMMM yyyy", {locale: locales["tr"],})}</time>
        <div className="author">Yazar: @{postInfo.author.username}</div>

        {userInfo === null ? (
            <span></span>
        ) : userInfo.id === postInfo.author._id ? (
            <div className="actions">
                <Link className="edit" to={`/edit/${postInfo._id}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    Edit
                </Link>
            </div>
        ) : null}
        

        <div className="image">
            <img src={'http://localhost:3030/'+postInfo.cover} alt="img" />
        </div>
        <div className='content' dangerouslySetInnerHTML={{__html:postInfo.content}} />

    </div>
  )
}

export default PostPage