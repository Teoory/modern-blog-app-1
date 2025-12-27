import { useContext } from 'react';
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { UserContext } from '../../Hooks/UserContext';
import Image from '../Image';

import snowNewsFreme from '../../Images/news-frame-christmas.png';

const Post = ({_id,title, summary,cover,content,createdAt, author, PostTags}) => {
  const { theme } = useContext(UserContext);

  const locales = { tr, eu };
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <div style={{ position: 'relative' }}>
            <Image src={cover} alt="img" loading='layz' decoding='async' />
            {theme === 'winter' && (
                <img 
                  src={snowNewsFreme} 
                  alt="Winter Frame"
                  style={{
                    position: 'absolute',
                    top: '-10%',
                    left: 0,
                    width: '100%',
                    height: '115%',
                    objectFit: 'cover',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                />
            )}
          </div>
        </Link>
      </div>
      <div className="text">
        <Link to={`/post/${_id}`}>
          <span className='PostTagsArea'>{PostTags}</span>
          <h1>{title}</h1>
          <p className="info">
            <Link to={`/profile/${author.username}`} className="author">{author.username}</Link>
            <time>
              {format(new Date(createdAt), "HH:mm | dd MMMM yyyy", {
                locale: locales["tr"],
              })}
            </time>
          </p>
        </Link>
        <Link to={`/post/${_id}`}>
          <p className="summary">{summary}</p>
        </Link>
      </div>
    </div>
  )
}

export default Post