import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './Footer.css';

const Footer = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    function updateOnlineStats() {
        fetch('https://fiyasko-blog-api.vercel.app/totalUsers')
        .then(response => response.json())
        .then(totalUsers => {
            setTotalUsers(totalUsers);
        })
        .catch(error => {
          console.error('Hata:', error);
        });
    };

    setInterval(updateOnlineStats, 120000);

    return (
        <footer className="footer">
            <div className="ft-top">
                <div className="ft-top-tx">
                    <div className="ft-top-tw">
                        😎<span>Toplam Üye: </span><span>{totalUsers}</span>
                        <span> | </span>
                    </div>
                    <div>
                        <Link to="/" className="ft-href">Ana Sayfa</Link>
                        <Link to="/settings" className="ft-href">Ayarlar</Link>
                        <a href='mailto:kkslab.info@gmail.com' className="ft-href">İletişim</a>
                    </div>
                </div>
                <div className="ft-bot-tx">
                    <a>
                        <a target="_blank" href="https://www.linkedin.com/in/berkay-koksal/" rel="nofollow"><span>KKSLAB tarafından geliştirilmiştir.</span></a>
                        <br />
                        <a target="_blank" href="https://fiyasko.online/privacy" rel="nofollow"><span>© 2024 Sitemizin tüm hakları gizlidir.</span></a>
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;