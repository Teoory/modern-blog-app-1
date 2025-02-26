import { useEffect, useState, useContext } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom'
import { UserContext } from '../../Hooks/UserContext';
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';
import Image from '../../components/Image';
import { API_BASE_URL } from '../../config';

const NotificationsPage = () => {
    const { setUserInfo, userInfo } = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/profile`, {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/notifications/${userInfo.id}`);
                console.log(response);
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                } else {
                    console.error('Bildirimleri getirirken bir hata oluştu.');
                }
            } catch (error) {
                console.error('Bildirimleri getirirken bir hata oluştu.', error);
            }
        };

        fetchNotifications();
    }, []);

    useEffect(() => {
        const markAllNotificationsAsRead = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/mark-all-notifications-as-read`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: userInfo.id }), // Kullanıcı kimliğini gönder
                    credentials: 'include'
                });
                if (response.ok) {
                    // console.log('Tüm bildirimler başarıyla okundu olarak işaretlendi.');
                } else {
                    console.error('Bildirimler okunamadı.');
                }
            } catch (error) {
                console.error('Bir hata oluştu:', error);
            }
        };
        markAllNotificationsAsRead();
    }, [userInfo]);
    

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

    // document.title = 'Bildirimler - Fiyasko Blog';
    // useEffect(() => {
    //     const element = document.querySelector('.aside');
    //     element.style.display = 'none';
    //     return () => {
    //         if(window.innerWidth > 1280)
    //         element.style.display = 'block';
    //         else if (window.innerWidth <= 1280)
    //         element.style.display = 'contents';
    //     };
    // }, []);


    const locales = { tr, eu };
    return (
        <div>
            <h1>Bildirimler</h1>
            <div>
                {notifications.length === 0 && <h5>Bildiriminiz bulunmamaktadır.</h5>}
                {notifications.map(notification => (
                    <>
                    {notification.sender.username !== userInfo.username &&
                    <li className='NotificationListItem' key={notification._id}>
                        <div className="NotificationArea">
                            <Image src={notification.sender.profilePhoto} alt={notification.sender.username} className='ProfilePhoto'/>
                            <Link to={`/profile/${notification.sender.username}`}> @{notification.sender.username} </Link>  kullanıcısı,
                            {notification.post && (
                                <>
                                <Link to={`/post/${notification.post?._id}`}>"{notification.post?.title}"</Link>
                                {notification.type === 'Yorum' && <span> bloguna yorum yaptı.</span>}
                                {notification.type === 'like' && <span> blogunu beğendi.</span>}
                                {notification.type === 'Bahset' && <span> blogunda senden bahsetti.</span>}
                                </>
                            )}
                            {notification.test && (
                                <>
                                <Link to={`/test/${notification.test?._id}`}>"{notification.test?.title}"</Link>
                                {notification.type === 'Yorum' && <span> testine yorum yaptı.</span>}
                                {notification.type === 'like' && <span> testini beğendi.</span>}
                                {notification.type === 'Bahset' && <span> testinde senden bahsetti.</span>}
                                </>
                            )}
                            {/* <span> {notification.type} yaptı.</span> */}
                        </div>
                        <button className='NotificationDelButton' onClick={() => {
                            fetch(`${API_BASE_URL}/notifications/${userInfo.id}/${notification._id}`, {
                                method: 'DELETE',
                                credentials: 'include'
                            }).then(response => {
                                if (response.ok) {
                                    setNotifications(notifications.filter(n => n._id !== notification._id));
                                } else {
                                    console.error('Bildirim silinemedi.');
                                }
                            }
                            );
                        }
                        }>Sil</button>

                        <span className='commentTime'><time>{format(new Date(notification.createdAt), "HH:mm / dd MMMM yyyy", {locale: locales["tr"],})}</time></span>
                        {/* <span className='commentTime'>{formatDate(notification.createdAt)}</span> */}
                    </li>
                    }
                    </>
                ))}
            </div>
        </div>
    );
};

export default NotificationsPage