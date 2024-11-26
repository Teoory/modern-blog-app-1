import { useContext, useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';
import { UserContext } from '../../Hooks/UserContext';
import Image from '../../components/Image';
// import '../../QuillSnow.css';
import Post from '../../components/Post/Post';
import DOMPurify from 'dompurify';
import 'ckeditor5/ckeditor5.css';
import CKEditorComponent from "../../components/Editor/CKView";

const PostPage = () => {
    const [postInfo, setPostInfo] = useState(null);
    const {userInfo} = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [superlikes, setSuperLikes] = useState(0);
    const [isSuperLiked, setHasSuperLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const {id} = useParams();
    const [posts, setPosts] = useState([]);
    
    useEffect(() => {
        fetch(`https://fiyasko-blog-api.vercel.app/post/${id}`)
            .then(response => {
                if(!response.ok) {
                    setRedirect(true);
                    return;
                }
                response.json().then(postInfo => {
                    setPostInfo(postInfo);
                })
            })
    }, [id]);
        
    useEffect(() => { 
        fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/comments`)
            .then(response => response.json())
            .then(comments => setComments(comments))
    }, [id]);
    
    useEffect(() => {
        fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/likes`)
          .then(response => response.json())
          .then(data => {
            setLikes(data.likes);
          });

          fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/hasLiked`,{
              method: 'GET',
              credentials: 'include',
          })
              .then(response => response.json())
              .then(data => {
                setIsLiked(data.hasLiked);
              });
    }, [id]);

    useEffect(() => {
        fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/superlikes`)
          .then(response => response.json())
          .then(data => {
            setSuperLikes(data.superlikes);
          });

        fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/hasSuperLiked`,{
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                setHasSuperLiked(data.hasSuperLiked);
            });
    }, [id]);

    
    useEffect(() => {
    fetch('https://fiyasko-blog-api.vercel.app/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
    }, []);
    
    const sendNotification = async (senderId, receiverId, postId, type) => {
        try {
            const response = await fetch('https://fiyasko-blog-api.vercel.app/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    senderId: senderId,
                    receiverId: receiverId,
                    postId: postId,
                    type: type
                })
            });
            if (response.ok) {
                // console.log('Bildirim gönderildi.');
            } else {
                console.error('Bildirim gönderilirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Bildirim gönderilirken bir hata oluştu.', error);
        }
    };

    const deletePost = async () => {
        try {
            const response = await fetch(`https://fiyasko-blog-api.vercel.app/post/${postInfo._id}`, {
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
          const response = await fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/like`, {
            method: 'POST',
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const updatedData = await response.json();
          setLikes(updatedData.likes);
          setIsLiked(updatedData.isLiked);
        } catch (error) {
          console.error('Error toggling like:', error.message);
        }
    };

    const toggleSuperLike = async () => {
        try {
          const response = await fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/superlike`, {
            method: 'POST',
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const updatedData = await response.json();
          setSuperLikes(updatedData.superlikes);
          setHasSuperLiked(updatedData.isSuperLiked);

        } catch (error) {
          console.error('Error toggling superlike:', error.message);
        }
    };

    const addComment = async () => {
        try {
            const response = await fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/comment`, {
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
            const updatedComments = await fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/comments`)
                .then(response => response.json());

            setComments(updatedComments);
            setNewComment('');

            const mentionedUsers = newComment.match(/@(\w+)/g);
            if (mentionedUsers) {
                await Promise.all(mentionedUsers.map(async (username) => {
                    const receiverUser = await fetch(`https://fiyasko-blog-api.vercel.app/profile/${username.slice(1)}`)
                        .then(response => response.json());
                    if (receiverUser && receiverUser.user._id !== userInfo.id) {
                        await sendNotification(userInfo.id, receiverUser.user._id, postInfo._id, 'Bahset');
                    }
                }));
            }                   

            if (userInfo.id !== postInfo.author._id)
            await sendNotification(userInfo.id, postInfo.author._id, postInfo._id, 'Yorum');
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
    // document.title = postInfo?.title + " | Fiyasko Blog" || 'Yükleniyor...';

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
        <div className="author">Yazar: @<Link to={`/profile/${postInfo.author.username}`}>{postInfo.author.username}</Link></div>
        <div className="PostTags"><span>{postInfo.PostTags}</span></div>
        <div className="author">
            <span className='postInfoWnL'>📃 {postInfo.totalViews}</span>
            <span className='postInfoWnL'>😍 {likes+superlikes}</span>
        </div>

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
            {/* <img src={'https://fiyasko-blog-api.vercel.app/'+postInfo.cover} alt="img" /> */}
            <Image src={postInfo.cover} alt="img" />
        </div>
        {/* <div className='content' dangerouslySetInnerHTML={{__html:postInfo.content}} /> */}
        <div className='content' style={{marginTop:'20px'}}>
            <CKEditorComponent value={postInfo.content} onChange={() => {}} readOnly={true} />
        </div>
        {/* <div className='content' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(postInfo.content) }} /> */}
        


        <div className="LikesArea">
            <div className='LikeButtons'>
                <div className="likeArea">
                    <span className='LikesCount'>{likes}</span>
                    {userInfo !== null 
                    ?   <button onClick={toggleLike} className={isLiked ? 'liked' : ''}>
                            😍
                        </button>
                    :   <div className='LikeSVG'>😍</div>
                    }
                </div>
                <div className="superlikesArea">
                    <span className='SuperLikesCount'>{superlikes}</span>
                    {userInfo !== null 
                    ?   <button onClick={toggleSuperLike} className={isSuperLiked ? 'superliked' : ''}>
                            👻
                        </button>

                    :   <div className='LikeSVG'>👻</div>
                    }
                </div>
            </div>
            {userInfo == null &&
                <span className='CommentLogin'>Beğenmek için <Link to="/login">giriş yapın</Link></span>
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
                    <button className='CommAddButton' onClick={addComment}>Yorum Yap</button>
                </div>
            ) : (
                <span className='CommentLogin'>Yorum yapmak için <Link to="/login">giriş yapın</Link></span>
            )}
            
            {comments.length === 0
            ?   <h3>Buralar biraz sessiz!</h3>
            :   <div>
                    {comments.map(comment => (
                        <>
                        <div key={comment._id} className="comment">
                            <div className="commentInfo">
                                <div>
                                    <Link to={`/profile/${comment.author.username}`}>
                                        {/* <img src={`https://fiyasko-blog-api.vercel.app/${comment.author.profilePhoto}`} alt="*" /> */}
                                        <Image src={comment.author.profilePhoto} alt="*" />
                                    </Link>
                                    <span className='commentAuthorHeader'>Yazar: </span>
                                    <span className='commentAuthor'>
                                        <Link to={`/profile/${comment.author.username}`}>{comment.author.username}</Link>
                                    </span>
                                </div>
                                <span className='commentTime'>{formatDate(comment.createdAt)}</span>
                            </div>

                            <p>{comment.content}</p>
                        </div>
                        {userInfo !== null && (userInfo.id === comment.author._id || isAdmin || isModerator || isEditor) &&
                            <>
                                <button className='CommDelButton' onClick={() => {
                                    if(window.confirm('Bu işlem geri alınamaz. Silmek istediğinize emin misiniz?')) {
                                        fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/comment/${comment._id}`, {
                                            method: 'DELETE',
                                            credentials: 'include',
                                        }).then(() => {
                                            const updatedComments = comments.filter(c => c._id !== comment._id);
                                            setComments(updatedComments);
                                        });
                                    }
                                }}>Delete</button>
                            </>
                        }
                        </>
                    ))}
                </div>
            }
        </div>

        <div className="related-posts">
            <h2>Benzer Gönderiler</h2>
            <div className="posts">
                {posts.length > 0 && (() => {
                    const relatedPosts = posts.filter(post => 
                        post.PostTags === postInfo.PostTags && post._id !== postInfo._id
                    );
                    const displayPosts = relatedPosts.length > 0 
                        ? relatedPosts.slice(0, 3)
                        : [...posts]
                            .filter(post => post._id !== postInfo._id)
                            .sort(() => Math.random() - 0.5)
                            .slice(0, 3);
                
                    return displayPosts.map(post => (
                        <Post {...post} key={post._id} />
                    ));
                })()}
            </div>
        </div>
    </div>
  )
}

export default PostPage