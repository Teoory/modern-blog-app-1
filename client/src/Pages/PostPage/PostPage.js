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
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentCount, setCommentCount] = useState('');
    const {id} = useParams();

    useEffect(() => {
        fetch(`http://localhost:3030/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo);
                })
            })

        fetch(`http://localhost:3030/post/${id}/comments`)
            .then(response => response.json())
            .then(comments => setComments(comments))
    
        Promise.all([
                fetch(`http://localhost:3030/post/${id}/likes`).then(response => response.json()),
                fetch(`http://localhost:3030/post/${id}/hasLiked`, { credentials: 'include' }).then(response => response.json()),
            ]).then(([likesData, hasLikedData]) => {
                setLikes(likesData.likes);
                setHasLiked(hasLikedData.hasLiked);
        });
}, []);

const deletePost = async () => {
    try {
        const response = await fetch(`http://localhost:3030/post/${postInfo._id}`, {
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

const toggleLike = async () => {
    try {
        const endpoint = hasLiked ? 'unlike' : 'like';
        const response = await fetch(`http://localhost:3030/post/${id}/like`, {
            method: hasLiked ? 'DELETE' : 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Update the number of likes and like status after adding or removing a like
        const updatedLikes = await fetch(`http://localhost:3030/post/${id}/likes`)
            .then(response => response.json());

        setLikes(updatedLikes.likes);
        setHasLiked(!hasLiked);
    } catch (error) {
        console.error(`Error ${hasLiked ? 'removing' : 'adding'} like:`, error.message);
    }
};


const addComment = async () => {
    try {
        const response = await fetch(`http://localhost:3030/post/${id}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newComment }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updatedComments = await fetch(`http://localhost:3030/post/${id}/comments`)
            .then(response => response.json());

        setComments(updatedComments);
        setNewComment('');
    } catch (error) {
        console.error('Error adding comment:', error.message);
    }
};

const formatDate = (dateString) => {
    const opt = {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    };

    return new Date(dateString).toLocaleDateString('tr-TR', opt);
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

         {/* Bu alan post bilgilerini gösteriyor. */}
        <div className="image">
            <img src={'http://localhost:3030/'+postInfo.cover} alt="img" />
        </div>
        <div className='content' dangerouslySetInnerHTML={{__html:postInfo.content}} />


        <div className="LikesArea">
            {userInfo !== null 
                ?   <div className='LikeButtons'>
                        <div className="superlikesArea">
                            <span className='SuperLikesCount'>{'SUPERLIKE2'}</span>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                            </button>
                        </div>
                        <div className="likeArea">
                        <span className='LikesCount'>{likes}</span>
                            <button onClick={toggleLike}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="orange" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                :   <span className='CommentLogin'>Beğenmek için <Link to="/login">giriş yapın</Link></span>
            }
        </div>

        <div className='CommentsArea'>
            <div className='Comments'>
                <div className='CommentsHeader'>Yorumlar</div>
                {comments.length === 0 
                    ?   <div><span className='FirstComment'>İlk yorumu siz yapın!</span></div>
                    :   <span className='CommentsCount'>{comments.length}</span>
                }
            </div>
            
            {userInfo !== null ? (
                <div className='addComment'>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Yorumunuzu yazın..."
                        rows="4"
                        cols="50"
                        maxLength={256}
                    />
                    <button onClick={addComment}>Yorum Yap</button>
                </div>
            ) : (
                <span className='CommentLogin'>Yorum yapmak için <Link to="/login">giriş yapın</Link></span>
            )}
            
            {comments.length === 0
                ?   <h3>Buralar biraz sessiz!</h3>
                :   <div>
                        {comments.map(comment => (
                            <div key={comment._id} className="comment">
                                <div className="commentInfo">
                                    <span className='commentAuthorHeader'>Yazar:</span>
                                    <span className='commentAuthor'> @{comment.author.username}</span>
                                    <span className='commentTime'>{formatDate(comment.createdAt)}</span>
                                </div>

                                <p>{comment.content}</p>
                            </div>
                        ))}
                    </div>
            }
        </div>
    </div>
  )
}

export default PostPage