import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../Hooks/UserContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const VerifyPage = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const { userInfo } = useContext(UserContext);
    const navigate = useNavigate();

    const verifyEmail = async (ev) => {
        ev.preventDefault();

        const response = await fetch(`${API_BASE_URL}/verify-email`, {
            method: 'POST',
            body: JSON.stringify({ verificationCode }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            alert('E-posta doğrulama başarılı!');
            navigate('/login');
        } else {
            alert('E-posta doğrulama başarısız! Lütfen tekrar deneyin.');
        }
    };
    const email = userInfo?.email;

    const requestNewCode = async () => {
        const response = await fetch(`${API_BASE_URL}/request-verify-code`, {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            alert('Yeni doğrulama kodu başarıyla gönderildi.');
        } else {
            alert('Yeni doğrulama kodu isteği başarısız! Lütfen tekrar deneyin.');
        }
    };
    



    return (
        <div className='loginArea Verify'>
            <form className="login" onSubmit={verifyEmail}>
                <h1>E-posta Doğrulama</h1>
                <input
                    type="text"
                    placeholder="Doğrulama Kodu"
                    value={verificationCode}
                    required
                    onChange={ev => setVerificationCode(ev.target.value)}
                />
                <button>E-posta Doğrula</button>
            </form>
            <div className='requestArea'>
                <button onClick={requestNewCode}>Yeni Kod İste</button>
            </div>
        </div>
    );
}

export default VerifyPage