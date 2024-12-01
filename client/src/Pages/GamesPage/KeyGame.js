import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../Hooks/UserContext';
import { API_BASE_URL } from '../../config';

const GamePage = () => {
    const { userInfo } = useContext(UserContext);
    const [game, setGame] = useState(null);
    const [answer, setAnswer] = useState(['', '', '', '']);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Günlük oyunu çek
    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/keygame-daily`, {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setGame(data);
                } else {
                    setMessage('Bugün için oyun bulunamadı.');
                }
            } catch (err) {
                setMessage('Oyun verilerini alırken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, []);

    // Cevap gönderme
    const handleSubmit = async () => {
        if (!userInfo) {
            setMessage('Oyun oynayabilmek için giriş yapmalısınız.');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/keygame-play`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    userId: userInfo.id,
                    gameNumber: game.gameNumber,
                    userAnswer: answer.map(Number),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.isCorrect
                    ? 'Tebrikler, doğru bildiniz!' 
                    : `Üzgünüm yanlış cevap, yarın tekrar deneyebilirsiniz. Doğru cevap: ${data.correctAnswer.join('')}`);
            }
        } catch (err) {
            setMessage('Üzgünüm yanlış cevap, yarın tekrar deneyebilirsiniz.');
        }
    };

    if (loading) {
        return <p>Yükleniyor...</p>;
    }

    if (!game) {
        return <p>{message || 'Bugün için oyun bulunamadı.'}</p>;
    }

    const formatClue = (clue) => {
        const numbers = clue.substring(0, 4).split('');
        const text = clue.substring(4).trim();
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {numbers.map((num, index) => (
                    <div key={index} style={{
                        width: '30px',
                        height: '30px',
                        border: '1px solid var(--color-warning)',
                        backgroundColor: 'var(--color-white)',
                        borderRadius: '5px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: '5px',
                        fontWeight: 'bold'
                    }}>
                        {num}
                    </div>
                ))}
                <span>{text}</span>
            </div>
        );
    };

    return (
        <div style={{display:'flex',justifyContent:'center'}}>
            <div style={{width:'75%',display:'flex',flexDirection:'column',alignItems:'center',background:'#222',borderTopLeftRadius:'5px',borderTopRightRadius:'5px',textTransform:'capitalize'}}>
                <h1 style={{margin:'5px 0'}}>Günlük Oyun</h1>
                <p style={{margin:'5px 0 20px 0'}}>Her gün saat 12:00'de oyun yenilenir.</p>
                <div>
                    {game.clues.map((clue, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            {formatClue(clue)}
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
                    {answer.map((val, index) => (
                        <input
                            key={index}
                            type="number"
                            min={1}
                            max={9}
                            value={val}
                            onChange={(e) => {
                                const newAnswer = [...answer];
                                newAnswer[index] = e.target.value;
                                setAnswer(newAnswer);
                            }}
                            style={{ width: '50px', textAlign: 'center' }}
                        />
                    ))}
                </div>
                <button onClick={handleSubmit} disabled={!answer.every((val) => val !== '')}>
                    Cevabı Gönder
                </button>
                {message && message.includes('yanlış') && (
                    <p style={{ color: 'var(--color-danger)', marginTop: '10px' }}>{message}</p>
                )}
                {message && message.includes('doğru') && (
                    <p style={{ color: 'var(--color-success)', marginTop: '10px' }}>{message}</p>
                )}
            </div>
        </div>
    );
};

export default GamePage;