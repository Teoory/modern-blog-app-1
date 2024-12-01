import React, { useState, useContext } from 'react';
import { UserContext } from '../../Hooks/UserContext';
import { API_BASE_URL } from '../../config';

const AddGamePage = () => {
    const { userInfo } = useContext(UserContext);
    const [correctAnswer, setCorrectAnswer] = useState(['', '', '', '']);
    const [clues, setClues] = useState([
        { numbers: ['', '', '', ''], text: '' },
        { numbers: ['', '', '', ''], text: '' },
        { numbers: ['', '', '', ''], text: '' },
        { numbers: ['', '', '', ''], text: '' },
    ]);
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        // Verileri database formatına uygun hale getir
        const formattedClues = clues.map((clue) => {
            const combinedNumbers = clue.numbers.join('');
            return `${combinedNumbers} ${clue.text}`;
        });

        try {
            const response = await fetch(`${API_BASE_URL}/keygame-add-game`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    correctAnswer: correctAnswer.map(Number),
                    clues: formattedClues,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Oyun başarıyla eklendi.');
                setCorrectAnswer(['', '', '', '']);
                setClues([
                    { numbers: ['', '', '', ''], text: '' },
                    { numbers: ['', '', '', ''], text: '' },
                    { numbers: ['', '', '', ''], text: '' },
                    { numbers: ['', '', '', ''], text: '' },
                ]);
            } else {
                setMessage(data.message || 'Oyun eklenirken bir hata oluştu.');
            }
        } catch (err) {
            setMessage('Oyun eklenirken bir hata oluştu.');
        }
    };

    return (
        <div>
                <h1>Yeni Oyun Ekle</h1>
                <div style={{ margin: '20px 0' }}>
                    <h3>Doğru Cevap</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {correctAnswer.map((val, index) => (
                            <input
                                key={index}
                                type="number"
                                value={val}
                                min={0}
                                max={9}
                                onChange={(e) => {
                                    const newAnswer = [...correctAnswer];
                                    newAnswer[index] = e.target.value;
                                    setCorrectAnswer(newAnswer);
                                }}
                                style={{ width: '50px', textAlign: 'center' }}
                            />
                        ))}
                    </div>
                </div>
                <div style={{ margin: '20px 0' }}>
                    <h3>İpuçları</h3>
                    {clues.map((clue, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                                {clue.numbers.map((num, numIndex) => (
                                    <input
                                        key={numIndex}
                                        type="number"
                                        value={num}
                                        min={1}
                                        max={9}
                                        onChange={(e) => {
                                            const newClues = [...clues];
                                            newClues[index].numbers[numIndex] = e.target.value;
                                            setClues(newClues);
                                        }}
                                        style={{ width: '50px', textAlign: 'center' }}
                                    />
                                ))}
                            </div>
                            <textarea
                                value={clue.text}
                                onChange={(e) => {
                                    const newClues = [...clues];
                                    newClues[index].text = e.target.value;
                                    setClues(newClues);
                                }}
                                rows="2"
                                style={{ width: '100%' }}
                                placeholder={`İpucu ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={
                        !correctAnswer.every((val) => val !== '') ||
                        clues.some((clue) => clue.numbers.some((num) => num === '') || clue.text === '')
                    }
                >
                    Oyun Ekle
                </button>
                {message && <p>{message}</p>}
        </div>
    );
};

export default AddGamePage;
