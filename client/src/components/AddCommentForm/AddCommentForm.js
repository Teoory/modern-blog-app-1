// import axios from "axios";
import { useState } from "react";

const AddCommentForm = ({ id, onBlogUpdated }) => {
    const [name, setName] = useState('');
    const [commentText, setCommentText] = useState('');

    // const addComment = async () => {
    //     const response = await axios.post(`/post/${id}/comments`, {
    //         postedBy: name,
    //         text: commentText,
    //     });
    //     const updatedBlog = response.data;
    //     onBlogUpdated(updatedBlog);
    //     setName('');
    //     setCommentText('');
    // }

    return(
        <div id="add-comment-form">
            <h3>Yorum Ekle</h3>
            <label>
                Adı:
                <input 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    type="text" />
            </label>
            <label>
                Yorumlar:
                <textarea 
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    rows="4"
                    cols="50" />
            </label>
            <button >Yorumu Gönder</button>
        </div>
    )
}

export default AddCommentForm;