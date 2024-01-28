import { Link } from "react-router-dom";
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="ft-top">
                <div className="ft-top-tx">
                    <Link to="/" className="ft-href">Blog</Link>
                    <Link to="/" className="ft-href">Hakkımda</Link>
                    <Link to="/" className="ft-href">İletişim</Link>
                </div>
                <div className="ft-bot-tx">
                    <a href="https://www.linkedin.com/in/berkay-koksal/">
                        <span>Berkay Köksal tarafından geliştirilmiştir.</span>
                        <br />
                        <span>© 2024 Sitemizin tüm hakları gizlidir.</span>
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;