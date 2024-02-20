import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../Hooks/UserContext';
import { useNavigate } from 'react-router-dom';

const VerifyPage = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const { setUserInfo, userInfo } = useContext(UserContext);
    const navigate = useNavigate();

    
  useEffect(() => {
        fetch('https://fiyasko-blog-api.vercel.app/profile', {
          credentials: 'include',
        }).then(response => {
          response.json().then(userInfo => {
            setUserInfo(userInfo);
          });
        });
    }, []);

    const verifyEmail = async (ev) => {
        ev.preventDefault();

        // Verification code'yi doğrulama işlemi
        const response = await fetch('https://fiyasko-blog-api.vercel.app/verify-email', {
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
        // Yeni bir doğrulama kodu isteği
        const response = await fetch('https://fiyasko-blog-api.vercel.app/request-verify-code', {
            method: 'POST',
            body: JSON.stringify({ email }), // E-posta adresini gönder
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