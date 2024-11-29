import { useState } from 'react';
import { Navigate } from "react-router-dom";
import Editor from "../../components/Editor/Editor";
import 'react-quill/dist/quill.snow.css';
import { API_BASE_URL } from '../../config';

const TicketCreatePage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('Open');
    const [redirect, setRedirect] = useState(false);

    async function createNewTicket(ev) {
        const data = new FormData();
        data.set('title', title);
        data.set('content', content);
        data.set('status', status);
        ev.preventDefault();
        const response = await fetch(`${API_BASE_URL}/ticket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content, status }),
            credentials: 'include',
        });
        if (response.ok) {
            const responseData = await response.json();
            console.log('Ticket oluşturuldu:', responseData.ticketDoc);
            setRedirect(true);
        }
    }

    if(redirect) {
        return <Navigate to={'/'}/>
    }

    return (
        <>
            <form onSubmit={createNewTicket}>
                <select value={status} onChange={ev => setStatus(ev.target.value)}>
                    <option value="Open">Open</option>
                </select>
                <input  type="title" 
                        placeholder={'Title'} 
                        value={title} 
                        onChange={ev => setTitle(ev.target.value)}/>

                <Editor value={content} onChange={setContent} />
                <button style={{marginTop:'5px'}}>Gönderi oluştur</button>
            </form>
        </>
    )
}

export default TicketCreatePage