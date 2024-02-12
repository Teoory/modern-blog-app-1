import react from 'react'
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const PrevievPost = ({_id,title, summary,cover,content,createdAt, author, PostTags}) => {
    const locales = { tr, eu };
    return (
        <div className="post">
          <div className="image">
            <Link to={`/previevPost/${_id}`}>
              <img src={'http://localhost:3030/'+cover} alt="img" loading='layz' decoding='async'/>
            </Link>
          </div>
          <div className="text">
            <Link to={`/previevPost/${_id}`}>
              <span className='PostTagsArea'>{PostTags}</span>
              <h1>{title}</h1>
              <p className="info">
                <a className="author">{author.username}</a>
                <time>
                  {format(new Date(createdAt), "HH:MM | dd MMMM yyyy", {
                    locale: locales["tr"],
                  })}
                </time>
              </p>
            </Link>
            <Link to={`/previevPost/${_id}`}>
              <p className="summary">{summary}</p>
            </Link>
          </div>
        </div>
    )
}

export default PrevievPost