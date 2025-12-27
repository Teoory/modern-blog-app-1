import { useContext } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { UserContext } from '../../Hooks/UserContext';
import { API_BASE_URL } from '../../config';

import snowNewsFreme from '../../Images/news-frame-christmas-slider.png';

const BlogSlider = ({ featuredPosts }) => {
  const { userInfo, theme } = useContext(UserContext);
  const tags = userInfo?.tags;
  const isAdmin = tags?.includes('admin');


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 9000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleRemoveHighlight = async (postId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/post/unfeature/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to unfeature post');
      }

      alert('Post unfeatured successfully');
    } catch (error) {
      console.error('Error unfeaturing post:', error);
    }
  };



  return (
    <div className="slider-container">
      <Slider {...settings}>
        {featuredPosts.map((post) => (
          <div key={post._id} className="slider-item">
            <div className="image-wrapper">
              {isAdmin && (
                <button
                  style={{ position: 'absolute', top: 10, right: 10, width: 200, height: 40, zIndex: 10, fontSize: 16, backgroundColor: 'red', color: 'white', transition: 'background-color 0.3s ease' }}
                  onClick={() => handleRemoveHighlight(post._id)}
                >
                  Öne Çıkarmayı Kaldır
                </button>
              )}
              <a href={`/post/${post._id}`} className="slider-link">
                <img src={post.cover} alt={post.title} />
                
      {theme === 'winter' && (
          <img
            src={snowNewsFreme}
            alt="Snow News Frame"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          />
      )}
                <div className="title-overlay">
                  <h3 >{post.title}</h3>
                </div>
              </a>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BlogSlider;