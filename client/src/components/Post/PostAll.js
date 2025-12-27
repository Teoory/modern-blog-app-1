import { useContext } from 'react';
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { UserContext } from '../../Hooks/UserContext';
import Image from '../Image';

import snowNewsFreme from '../../Images/news-frame-christmas2.png';

const PostAll = ({ _id, title, summary, cover, content, createdAt, author, PostTags }) => {
  const { theme } = useContext(UserContext);


  const locales = { tr, eu };
  return (
    <div className="allPosts">
      <div className="image" style={{ position: 'relative' }}>
        <Link to={`/post/${_id}`}>
          <Image 
            src={cover} 
            alt="img" 
            loading='layz' 
            decoding='async'
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              width: '100%',
              borderRadius: '15px 15px 0 0',
              maxHeight: '200px',
              height: '200px'
            }}
          />

          {theme === 'winter' && (
            <img
              src={snowNewsFreme}
              alt="Winter Frame"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
                borderRadius: '15px 15px 0 0'
              }}
            />
          )}
        </Link>
      </div>
      <div className="text">
        <span className='PostTagsAreaAll'>{PostTags}</span>
        <Link to={`/post/${_id}`}>
          <h1>{title}</h1>
          <p className="info">
            <Link to={`/profile/${author.username}`} className="author">{author.username}</Link>
            <time>
              {format(new Date(createdAt), "dd MMM yyyy", {
                locale: locales["tr"],
              })}
            </time>
          </p>
        </Link>
        <Link to={`/post/${_id}`}>
          {summary.length > 60 ? (
            <p className="summary">{summary.slice(0, 60)}...</p>
          ) : (
            <p className="summary">{summary}</p>
          )}
        </Link>
      </div>
    </div>
  )
}

export default PostAll