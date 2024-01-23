import { useState } from 'react'; // Add missing import

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email,setEmail] = useState('');

    async function register(ev) {
        ev.preventDefault();
        if (password !== confirmPassword) {
            alert('Şifreler birbiriyle eşleşmiyor!');
            return;
        }
        const response = await fetch('http://192.168.1.3:3030/register', {
            method: 'POST',
            body: JSON.stringify({username, password, email}),
            headers: {'Content-Type': 'application/json'},
        });
        if (response.status === 200) {
            alert('Basarıyla kayıt oldun!');
        } else {
            alert('Kayıt olurken hata oluştu!');
        }
    }
    
    return (
        <div>
          <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="email"
                    placeholder="email"
                    value={email}
                    onChange={ev => setEmail(ev.target.value)} />
            <input type="text"
                    placeholder="username"
                    value={username}
                    onChange={ev => setUsername(ev.target.value)} />
            <input type="password"
                    placeholder="password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)} />
            <input type="password"
                    placeholder="confirm password"
                    value={confirmPassword}
                    onChange={ev => setConfirmPassword(ev.target.value)} />
            <button>Register</button>
          </form>
        </div>
    )
}

export default RegisterPage