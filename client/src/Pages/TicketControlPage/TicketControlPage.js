import { useContext, useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';
import { UserContext } from '../../Hooks/UserContext';
import '../../QuillSnow.css';

const TicketControlPage = () => {
    const [ticketInfo, setTicketInfo] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const { userInfo } = useContext(UserContext);
    const [status, setStatus] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        fetch(`https://fiyasko-blog-api.vercel.app/ticket/${id}`).then(response => {
            response.json().then(ticketInfo => {
                setTicketInfo(ticketInfo);
            })
        })
    }, []);

    useEffect(() => {
        fetch('https://fiyasko-blog-api.vercel.app/profile', {
            credentials: 'include',
        });
    }, []);

    async function updateTicket(ev) {
        ev.preventDefault();
        const data = new FormData();
        data.set('status', status);
        ev.preventDefault();
        const response = await fetch(`https://fiyasko-blog-api.vercel.app/ticket/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status }),
            credentials: 'include',
        });
        if (response.ok) {
            const responseData = await response.json();
            console.log('Ticket güncellendi:', responseData.ticketDoc);
            reloadPage();
        }
    }

    const reloadPage = () => {
      window.reload();
    }
    
    const username = userInfo?.username;
    const tags = userInfo?.tags;
    const isAdmin = tags?.includes('admin');
    
    if(redirect) {
        return <Navigate to={'/'}/>
    }

    if(!ticketInfo) return <div>Loading...</div>;
    const locales = { tr, eu };

    console.log(ticketInfo.author.username, username, isAdmin)

    if (username === ticketInfo.author.username || isAdmin) {
        return (
            <div className='TicketArea'>
                <div className="TicketInfo">
                    <h1>{ticketInfo.title}</h1>
                    <time>{format(new Date(ticketInfo.createdAt), "HH:MM | dd MMMM yyyy", {locale: locales["tr"],})}</time>
                    <div className="author">Yazar: <Link to={`/profile/${ticketInfo.author.username}`}>{ticketInfo.author.username}</Link></div>
                    <div className="status">Durum: {ticketInfo.status}</div>
                    <form onSubmit={updateTicket}>
                        <select value={status} onChange={ev => setStatus(ev.target.value)}>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                        <button style={{marginTop:'5px'}}>Güncelle</button>
                    </form>
                </div>
                <div className='content' dangerouslySetInnerHTML={{__html:ticketInfo.content}} />
            </div>
        );
    } else 
    return <div>Yetkiniz Yok!</div>
}

export default TicketControlPage