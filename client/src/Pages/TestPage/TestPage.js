import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TestsAll from '../../components/Tests/Tests';
import { API_BASE_URL } from '../../config';

const TestPage = () => {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/tests`)
      .then(response => response.json())
      .then(data => {
        setTests(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching tests:', err);
        setError('Testler alınırken bir hata oluştu.');
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Yükleniyor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Testler</h1>
      {/* {tests.length > 0 ? (
        <ul>
          {tests.map(test => (
            <li key={test._id}>
              <h2>{test.title}</h2>
              <p>{test.summary}</p>
              {test.cover && <img src={test.cover} alt={test.title} style={{ width: '100px' }} />}
              <p><strong>Oluşturulma Tarihi:</strong> {new Date(test.createdAt).toLocaleDateString()}</p>
              <Link to={`/tests/${test._id}`}>Test Detaylarını Görüntüle</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Henüz test yok.</p>
      )} */}
      {tests.length > 0 && tests.map(test => (
        <TestsAll {...test} key={test._id} />
      ))}
      {tests.length === 0 && <p>Henüz test yok.</p>}
    </div>
  );
};

export default TestPage;