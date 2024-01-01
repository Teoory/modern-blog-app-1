import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';

const PostPage = () => {
    const [postInfo, setPostInfo] = useState(null);
    const {id} = useParams();
    useEffect(() => {
        fetch(`http://localhost:3030/post/${id}`).then(response => {
            response.json().then(postInfo => {
                setPostInfo(postInfo);                
            })
        })
}, []);

if (!postInfo) return <div>Loading...</div>
    const locales = { tr, eu };
  return (
    <div className="post-page">
        <h1>{postInfo.title}</h1>
        <time>{format(new Date(postInfo.createdAt), "HH:MM | dd MMMM yyyy", {locale: locales["tr"],})}</time>
        <div className="author">Yazar: @{postInfo.author.username}</div>
        <div className="image">
            <img src={'http://localhost:3030/'+postInfo.cover} alt="img" />
        </div>
        <div className='content' dangerouslySetInnerHTML={{__html:postInfo.content}} />

    </div>
  )
}

export default PostPage