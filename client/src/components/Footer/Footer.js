import { Link } from "react-router-dom";
import './Footer.css';

const Footer = () => {
    return (
        <div className="footer">
            <div className="ft-top">
                <div className="ft-top-tx">
                    <Link to="/" className="ft-href">Blog</Link>
                    <Link to="/" className="ft-href">Hakkımda</Link>
                    <Link to="/" className="ft-href">İletişim</Link>
                </div>
                <div className="ft-bot-tx">
                    <h6>© 2024 Sitemizin tüm hakları gizlidir.</h6>
                </div>
            </div>
        </div>
    )
}

export default Footer;