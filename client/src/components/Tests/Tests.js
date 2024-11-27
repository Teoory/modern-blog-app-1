import React from 'react'
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import Image from '../Image';

const TestsAll = ({_id, title, author, summary, cover, createdAt, TestTags}) => {

  const locales = { tr, eu };
  return (
    <div className="allPosts">
      <div className="image">
        <Link to={`/tests/${_id}`}>
          <Image src={cover} alt="img" loading='layz' decoding='async' />
        </Link>
      </div>
      <div className="text">
          <span className='PostTagsAreaAll'>{TestTags}</span>
        <Link to={`/tests/${_id}`}>
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
        <Link to={`/tests/${_id}`}>
        {summary.length > 60 ? (
          <p className="summary">{summary.slice(0,60)}...</p>
        ) : (
          <p className="summary">{summary}</p>
        )}
        </Link>
      </div>
    </div>
  )
}

export default TestsAll