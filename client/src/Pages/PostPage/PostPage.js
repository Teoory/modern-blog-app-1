import { useContext, useEffect, useState, useRef } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';
import { UserContext } from '../../Hooks/UserContext';
import Image from '../../components/Image';
import Post from '../../components/Post/Post';
import DOMPurify from 'dompurify';
import 'ckeditor5/ckeditor5.css';
import CKEditorComponent from "../../components/Editor/CKView";
import { API_BASE_URL } from '../../config';

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

    const [popupVisible, setPopupVisible] = useState(false);
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [cursorPosition, setCursorPosition] = useState(null);
    const popupRef = useRef(null);
    
    useEffect(() => {
        fetch(`${API_BASE_URL}/post/${id}`)
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
        fetch(`${API_BASE_URL}/post/${id}/comments`)
            .then(response => response.json())
            .then(comments => setComments(comments))
    }, [id]);
    
    useEffect(() => {
        fetch(`${API_BASE_URL}/post/${id}/likes`)
          .then(response => response.json())
          .then(data => {
            setLikes(data.likes);
          });

          fetch(`${API_BASE_URL}/post/${id}/hasLiked`,{
              method: 'GET',
              credentials: 'include',
          })
              .then(response => response.json())
              .then(data => {
                setIsLiked(data.hasLiked);
              });
    }, [id]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/post/${id}/superlikes`)
          .then(response => response.json())
          .then(data => {
            setSuperLikes(data.superlikes);
          });

        fetch(`${API_BASE_URL}/post/${id}/hasSuperLiked`,{
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                setHasSuperLiked(data.hasSuperLiked);
            });
    }, [id]);

    
    useEffect(() => {
    fetch(`${API_BASE_URL}/post`).then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
    }, []);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setPopupVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const sendNotification = async (senderId, receiverId, postId, type) => {
        try {
            const response = await fetch(`${API_BASE_URL}/send-notification`, {
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
            const response = await fetch(`${API_BASE_URL}/post/${postInfo._id}`, {
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

    const markAsFeatured = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/post/feature/${postInfo._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
    
        if (!response.ok) {
          throw new Error('Failed to feature post');
        }
    
        alert('Post added to featured slider!');
      } catch (error) {
        console.error('Error marking post as featured:', error);
      }
    };
    

    const toggleLike = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/post/${id}/like`, {
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
          const response = await fetch(`${API_BASE_URL}/post/${id}/superlike`, {
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




    const handleCommentChange = async (e) => {
        const { value } = e.target;
        setNewComment(value);
    
        const cursorIndex = e.target.selectionStart;
        const substring = value.substring(0, cursorIndex);
        const match = substring.match(/@(\w*)$/);
    
        if (match) {
          const query = match[1];
          if (query.length > 0) {
            try {
              const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'GET',
                credentials: 'include',
                contentType: 'application/json',
              });
              const users = await response.json();
              const filteredUsers = users
                .filter((user) => user.username.startsWith(query))
                .slice(0, 3); // İlk 3 sonucu al
              setUserSuggestions(filteredUsers);
              setPopupVisible(true);
              setCursorPosition(cursorIndex);
            } catch (error) {
              console.error('Error fetching user suggestions:', error);
            }
          }
        } else {
          setPopupVisible(false);
        }
      };
    
      const handleSuggestionClick = (username) => {
        const prefix = newComment.substring(0, cursorPosition).replace(/@\w*$/, `@${username} `);
        const suffix = newComment.substring(cursorPosition);
        setNewComment(`${prefix}${suffix}`);
        setPopupVisible(false);
      };
    

      const addComment = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/post/${id}/comment`, {
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
    
          const updatedComments = await fetch(`${API_BASE_URL}/post/${id}/comments`).then((res) =>
            res.json()
          );
          setComments(updatedComments);
          setNewComment('');
    
          const mentionedUsers = newComment.match(/@(\w+)/g);
          if (mentionedUsers) {
            await Promise.all(
              mentionedUsers.map(async (username) => {
                const receiverUser = await fetch(`${API_BASE_URL}/profile/${username.slice(1)}`).then(
                  (res) => res.json()
                );
                if (receiverUser && receiverUser.user._id !== userInfo.id) {
                  await sendNotification(userInfo.id, receiverUser.user._id, postInfo._id, 'Bahset');
                }
              })
            );
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
        <time>{format(new Date(postInfo.createdAt), "HH:mm | dd MMMM yyyy", {locale: locales["tr"],})}</time>
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
                <Link className="approve" onClick={markAsFeatured}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
                  </svg>
                  Öne Çıkar
                </Link>

                <Link className="edit" to={`/edit/${postInfo._id}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                  </svg>
                  Edit
                </Link>
                
                {isAdmin || isModerator ? (
                <Link className="delete" onClick={() => {
                    if(window.confirm('Bu işlem geri alınamaz. Silmek istediğinize emin misiniz?')) {
                        deletePost();
                    }
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                      <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                    </svg>
                    Delete
                </Link>
                ): null}
            </div>
        ) : null}

        <div className="image">
            <Image src={postInfo.cover} alt="img" />
        </div>
        <div className='content' style={{marginTop:'20px'}}>
            <CKEditorComponent value={postInfo.content} onChange={() => {}} readOnly={true} />
        </div>{/* <div className='content' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(postInfo.content) }} /> */}
        


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
              <div className="addComment">
                <textarea
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="Yorumunuzu yazın..."
                  rows="4"
                  cols="50"
                  maxLength={256}
                />
                <button className="CommAddButton" onClick={addComment}>
                  Yorum Yap
                </button>
                {popupVisible && (
                  <div ref={popupRef} className="popup">
                    {userSuggestions.map((user) => (
                      <div
                        key={user._id}
                        className="popup-item"
                        onClick={() => handleSuggestionClick(user.username)}
                      >
                        {user.username}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <span className="CommentLogin">
                Yorum yapmak için <Link to="/login">giriş yapın</Link>
              </span>
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
                                        <Image src={comment.author.profilePhoto} alt="*" />
                                    </Link>
                                    <span className='commentAuthorHeader'>Yazar: </span>
                                    <span className={`commentAuthor ${(comment.author.tags.includes('premium') && "commentPremium")}`}>
                                        <Link to={`/profile/${comment.author.username}`}>{comment.author.username}</Link>
                                    </span>
                                </div>
                                <span className='commentTime'>{formatDate(comment.createdAt)}</span>
                            </div>

                            {/* <p>{comment.content}</p> */}
                            <p>
                                {comment.content.split(/(@\w+)/g).map((part, index) => {
                                    if (part.startsWith('@')) {
                                        const username = part.substring(1);
                                        return (
                                            <Link key={index} to={`/profile/${username}`} className="mention-link">
                                                {part}
                                            </Link>
                                        );
                                    }
                                    return <span key={index}>{part}</span>;
                                })}
                            </p>
                        </div>
                        {userInfo !== null && (userInfo.id === comment.author._id || isAdmin || isModerator || isEditor) &&
                            <>
                                <button className='CommDelButton' onClick={() => {
                                    if(window.confirm('Bu işlem geri alınamaz. Silmek istediğinize emin misiniz?')) {
                                        fetch(`${API_BASE_URL}/post/${id}/comment/${comment._id}`, {
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