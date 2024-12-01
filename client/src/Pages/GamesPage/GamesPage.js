import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TestsAll from '../../components/Tests/Tests';
import { API_BASE_URL } from '../../config';
import keygame from '../../Images/keygame.png';

const GamesPage = () => {

  return (
    <div>
      <h1>Oyunlar</h1>
      <div style={{display:'flex',flexWrap:'wrap',gap:'20px'}}>
        <div className="lastPostImageOverlay">
            <Link to="/keygame" className='BlogTitle'>
                <img src={keygame} alt='img'/>
                <div className="lastPostTitle"><span>Keygame</span></div>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default GamesPage;