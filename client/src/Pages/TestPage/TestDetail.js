import React, { useContext,useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';
import { UserContext } from '../../Hooks/UserContext';
import Image from '../../components/Image';
import Test from '../../components/Tests/Tests';
import { API_BASE_URL } from '../../config';

const TestDetail = () => {
    const { id } = useParams();
    const [testInfo, setTestInfo] = useState(null);
    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const {userInfo} = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [superlikes, setSuperLikes] = useState(0);
    const [isSuperLiked, setHasSuperLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [tests, setTests] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/tests/${id}`)
            .then(response => {
                if(!response.ok) {
                    setRedirect(true);
                    return;
                }
                response.json().then(testData => {
                    setTest(testData);
                })
            })
    }, [id]);

    // useEffect(() => {
    //   const fetchTest = async () => {
    //     try {
    //       const response = await fetch(`${API_BASE_URL}/tests/${id}`);
    //       if (response.ok) {
    //         const testData = await response.json();
    //         setTest(testData);
    //       } else {
    //         console.error('Test verisi alınamadı.');
    //       }
    //     } catch (error) {
    //       console.error('API Hatası:', error);
    //     }
    //   };

    //   fetchTest();
    // }, [id]);

    useEffect(() => { 
        fetch(`${API_BASE_URL}/tests/${id}/comments`)
            .then(response => response.json())
            .then(comments => setComments(comments))
    }, [id]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/tests/${id}/likes`)
          .then(response => response.json())
          .then(data => {
            setLikes(data.likes);
          });

          fetch(`${API_BASE_URL}/tests/${id}/hasLiked`,{
              method: 'GET',
              credentials: 'include',
          })
              .then(response => response.json())
              .then(data => {
                setIsLiked(data.hasLiked);
              });
    }, [id]);
    
    useEffect(() => {
        fetch(`${API_BASE_URL}/tests/${id}/superlikes`)
          .then(response => response.json())
          .then(data => {
            setSuperLikes(data.superlikes);
          });

        fetch(`${API_BASE_URL}/tests/${id}/hasSuperLiked`,{
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                setHasSuperLiked(data.hasSuperLiked);
            });
    }, [id]);

    useEffect(() => {
    fetch('http://localhost:3030/tests').then(response => {
      response.json().then(posts => {
        setTests(tests);
      });
    });
    }, []);
    
    const sendNotification = async (senderId, receiverId, testId, type) => {
        try {
            const response = await fetch('http://localhost:3030/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    senderId: senderId,
                    receiverId: receiverId,
                    testId: testId,
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

    const handleAnswerSelect = (questionIndex, score) => {
      const updatedAnswers = {
        ...answers,
        [questionIndex]: score,
      };

      setAnswers(updatedAnswers);

      if (Object.keys(updatedAnswers).length === test.questions.length) {
        calculateResult(updatedAnswers);
      }
    };


  
    const toggleLike = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/tests/${id}/like`, {
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
          const response = await fetch(`${API_BASE_URL}/tests/${id}/superlike`, {
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
            const response = await fetch(`${API_BASE_URL}/tests/${id}/comment`, {
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
            const updatedComments = await fetch(`${API_BASE_URL}/tests/${id}/comments`)
                .then(response => response.json());

            setComments(updatedComments);
            setNewComment('');

            const mentionedUsers = newComment.match(/@(\w+)/g);
            if (mentionedUsers) {
                await Promise.all(mentionedUsers.map(async (username) => {
                    const receiverUser = await fetch(`${API_BASE_URL}/profile/${username.slice(1)}`)
                        .then(response => response.json());
                    if (receiverUser && receiverUser.user._id !== userInfo.id) {
                        await sendNotification(userInfo.id, receiverUser.user._id, test._id, 'Bahset');
                    }
                }));
            }                   

            if (userInfo.id !== test.author._id)
            await sendNotification(userInfo.id, test.author._id, test._id, 'Yorum');
        } catch (error) {
            console.error('Error adding comment:', error.message);
        }
    };

    const calculateResult = (currentAnswers) => {
        const totalScore = Object.values(currentAnswers).reduce((acc, score) => acc + score, 0);

        const matchedResult = test.resultMapping.find((result) =>
          result.conditions.every((condition) => {
            switch (condition.operator) {
              case '<':
                return totalScore < condition.value;
              case '<=':
                return totalScore <= condition.value;
              case '=':
                return totalScore === condition.value;
              case '>=':
                return totalScore >= condition.value;
              case '>':
                return totalScore > condition.value;
              default:
                return false;
            }
          })
        );

        setResult(matchedResult);
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

    
    const tags = userInfo?.tags;
    const isAdmin = tags?.includes('admin');
    const isModerator = tags?.includes('moderator');
    const isEditor = tags?.includes('editor');

    if (!test) {
      return <div>Yükleniyor...</div>;
    }

    const locales = { tr, eu };
    return (
    <div className="post-page">
        <h1>{test.title}</h1>
        <div className="author">
            <span className='postInfoWnL'>📃 {test.totalViews}</span>
            <span className='postInfoWnL'>😍 {likes+superlikes}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'16px',margin:'30px 0'}}>
            <Image src={test.author.profilePhoto} style={{width:'50px',height:'50px',borderRadius:'50%',objectFit:'cover'}} alt="img" />
            <div className='authorArea'>
                <div className="author">Yazar: <Link to={`/profile/${test.author.username}`}>{test.author.username}</Link></div>
                <time>{format(new Date(test.createdAt), "HH:mm - dd MMMM yyyy", {locale: locales["tr"],})}</time>
            </div>
        </div>
        <Image src={test.cover} style={{width:'100%',height:'100%',maxHeight:'300px',objectFit:'cover'}}  alt="img" />
        <p style={{margin:'0'}}>{test.summary}</p>
        <div>
        {test.questions.map((question, qIndex) => (
          <div key={qIndex} style={{marginTop:'50px'}}>
            <h3>{question.questionText}</h3>
        
            {question.image && <Image src={question.image} style={{width:'100%',height:'100%',maxHeight:'300px',objectFit:'cover'}} alt="img"/>}
            <div className='answerArea'>
                {question.answers.map((answer, aIndex) => (
                  <div
                    key={aIndex}
                    className={`answer ${answers[qIndex] === answer.score ? 'active-answer' : ''}`}
                    onClick={() => handleAnswerSelect(qIndex, answer.score)}
                  >
                    <span>{answer.answerText}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {result && (
        <div style={{display:'flex',flexDirection:'column'}}>
          <h2>Sonuç</h2>
          <p>{result.resultText}</p>
          {result.image && <img src={result.image} alt="Sonuç Görseli" style={{width:'100%',height:'100%',maxHeight:'400px',objectFit:'contain'}} />}
        </div>
      )}

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
                                        {/* <img src={`${API_BASE_URL}/${comment.author.profilePhoto}`} alt="*" /> */}
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
                                        fetch(`${API_BASE_URL}/tests/${id}/comment/${comment._id}`, {
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
                {tests.length > 0 && (() => {
                    const relatedPosts = tests.filter(post => 
                        post.TestsTags === testInfo.TestsTags && post._id !== testInfo._id
                    );
                    const displayPosts = relatedPosts.length > 0 
                        ? relatedPosts.slice(0, 3)
                        : [...tests]
                            .filter(tests => tests._id !== testInfo._id)
                            .sort(() => Math.random() - 0.5)
                            .slice(0, 3);
                
                    return displayPosts.map(tests => (
                        <Test {...tests} key={tests._id} />
                    ));
                })()}
                {tests.length === 0 && <div>Henüz hiç gönderi yok.</div>}
            </div>
        </div>

    </div>
  );
};

export default TestDetail;
