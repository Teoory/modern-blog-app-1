import PrevievPages from '../../components/PrevievPost/PrevievPost';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';

const PrevievPage = () => {
    const [previevPosts, setPrevievPosts] = useState([]);
    useEffect(() => {
        fetch(`${API_BASE_URL}/previevPost`).then(response => {
            response.json().then(previevPosts => {
                setPrevievPosts(previevPosts);
            });
        });
    }, []);
    return (
        <>
            <div className="posts">
                {previevPosts.length > 0 && previevPosts.map(previevPost => (
                    <PrevievPages {...previevPost} key={previevPost._id} />
                ))}
            </div>
        </>
    )
}

export default PrevievPage