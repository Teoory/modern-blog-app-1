import TicketPages from '../../components/Ticket/Ticket';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../Hooks/UserContext';
import '../../QuillSnow.css';
import { API_BASE_URL } from '../../config';

const TicketPage = () => {
    const { userInfo } = useContext(UserContext);
    const [previewTickets, setPreviewTickets] = useState([]);


    useEffect(() => {
        fetch(`${API_BASE_URL}/ticket`).then(response => {
            response.json().then(previewTickets => {
                setPreviewTickets(previewTickets);
            });
        });
    }, []);
    
    const username = userInfo?.username;
    const tags = userInfo?.tags;
    
    const isAdmin = tags?.includes('admin');
    const isModUp = tags?.includes('moderator') || isAdmin;

    return (
      <>
        <div className='warning' style={{color:'white'}}>Ticketlara buradan ulaşabilirsiniz.</div>
        <div className="posts">
              {previewTickets.length > 0 && previewTickets.map(previewTicket => (
              <TicketPages {...previewTicket} key={previewTicket._id} />
              ))}
        </div>
      </>
    )
}

export default TicketPage