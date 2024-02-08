import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../Hooks/UserContext';
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const Ticket = ({_id, title, content, author, status, createdAt}) => {
    const { setUserInfo, userInfo } = useContext(UserContext);
    const locales = { tr, eu };
    
    useEffect(() => {
        fetch('https://fiyaskoblog-api.vercel.app/profile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);
    
    const username = userInfo?.username;
    const tags = userInfo?.tags;
    
    const isAdmin = tags?.includes('admin');
    const isModUp = tags?.includes('moderator') || isAdmin;

  return (
    <>
    {(username === author.username) || (isModUp) ? (
    <div className='post'>
        <div className="text">
            <Link to={`/tickets/${_id}`}>
            <h1>{title}</h1>
            <p className="info">
                <Link to={`/profile/${author.username}`} className="author">{author.username}</Link>
                <span className='PostTagsArea'>Durum: {status}</span>
                <time>
                {format(new Date(createdAt), "HH:MM | dd MMMM yyyy", {
                    locale: locales["tr"],
                })}
                </time>
            </p>
            </Link>
        </div>
    </div>
    ) : null}
    </>
  )
}

export default Ticket