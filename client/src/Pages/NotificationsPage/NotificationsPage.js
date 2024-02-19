import { useEffect, useState, useContext } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom'
import { UserContext } from '../../Hooks/UserContext';
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';
import Image from '../../components/Image';

const NotificationsPage = () => {
    const { setUserInfo, userInfo } = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetch('https://fiyasko-blog-api.vercel.app/profile', {
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
                const response = await fetch(`https://fiyasko-blog-api.vercel.app/notifications/${userInfo.id}`);
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
                const response = await fetch('https://fiyasko-blog-api.vercel.app/mark-all-notifications-as-read', {
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

    const locales = { tr, eu };
    return (
        <div>
            <h1>Bildirimler</h1>
            <ul>
                {notifications.map(notification => (
                    <>
                    {notification.sender.username !== userInfo.username &&
                    <li className='NotificationListItem' key={notification._id}>
                        <div className="NotificationArea">
                            <Image src={notification.sender.profilePhoto} alt={notification.sender.username} className='ProfilePhoto'/>
                            <Link to={`/profile/${notification.sender.username}`}> @{notification.sender.username} </Link>  kullanıcısı,
                            "<Link to={`/post/${notification.post._id}`}>{notification.post.title}</Link>" adlı postuna 
                            <span> {notification.type} yaptı.</span>
                        </div>

                        <span className='commentTime'><time>{format(new Date(notification.createdAt), "HH:MM / dd MMMM yyyy", {locale: locales["tr"],})}</time></span>
                        {/* <span className='commentTime'>{formatDate(notification.createdAt)}</span> */}
                    </li>
                    }
                    </>
                ))}
            </ul>
        </div>
    );
};

export default NotificationsPage