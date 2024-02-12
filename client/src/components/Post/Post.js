import React from 'react'
import { format } from "date-fns";
import { tr, eu } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import Image from '../Image';

const Post = ({_id,title, summary,cover,content,createdAt, author, PostTags}) => {

  const locales = { tr, eu };
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          {/* <img src={'http://localhost:3030/'+cover} alt="img" loading='layz' decoding='async'/> */}
          {/* AWS için kapatıldı! */}
          <Image src={cover} alt="img" loading='layz'/>
        </Link>
      </div>
      <div className="text">
        <Link to={`/post/${_id}`}>
          <span className='PostTagsArea'>{PostTags}</span>
          <h1>{title}</h1>
          <p className="info">
            <Link to={`/profile/${author.username}`} className="author">{author.username}</Link>
            <time>
              {format(new Date(createdAt), "HH:MM | dd MMMM yyyy", {
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