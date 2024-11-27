import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { API_BASE_URL } from '../../config';

const CreateTest = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [files, setFiles] = useState('');
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, SetAvailableTags] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/availableTags`)
      .then(response => response.json())
      .then(data => SetAvailableTags(data.availableTags));
  }, []);

  const addQuestion = () => {
    const newQuestionIndex = questions.length + 1;
    setQuestions([...questions, { questionText: `${newQuestionIndex}. `, answers: [], image: '' }]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    const renumberedQuestions = updatedQuestions.map((q, i) => ({
      ...q,
      questionText: `${i + 1}. `,
    }));
    setQuestions(renumberedQuestions);
  };

  const addAnswer = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers.push({ answerText: '', score: 0 });
    setQuestions(updatedQuestions);
  };

  const removeAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers = updatedQuestions[questionIndex].answers.filter((_, i) => i !== answerIndex);
    setQuestions(updatedQuestions);
  };

  const addResult = () => {
    setResults([...results, { conditions: [], resultText: '', image: '' }]);
  };

  const removeResult = (index) => {
    setResults(results.filter((_, i) => i !== index));
  };

  const addCondition = (resultIndex) => {
    const updatedResults = [...results];
    updatedResults[resultIndex].conditions.push({ operator: '>=', value: 0 });
    setResults(updatedResults);
  };

  const removeCondition = (resultIndex, conditionIndex) => {
    const updatedResults = [...results];
    updatedResults[resultIndex].conditions = updatedResults[resultIndex].conditions.filter((_, i) => i !== conditionIndex);
    setResults(updatedResults);
  };

  const calculateMinMaxScores = () => {
    const maxScore = questions.reduce(
      (acc, q) => acc + Math.max(...q.answers.map(a => a.score), 0),
      0
    );
    const minScore = questions.reduce(
      (acc, q) => acc + Math.min(...q.answers.map(a => a.score), Infinity),
      0
    );
    return { maxScore, minScore: minScore === Infinity ? 0 : minScore };
  };

  async function createNewTest(ev) {
    ev.preventDefault();
    const { maxScore, minScore } = calculateMinMaxScores();

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('file', files[0]);
    data.set('TestTags', selectedTags);
    data.set('questions', JSON.stringify(questions));
    data.set('resultMapping', JSON.stringify(results));
    data.set('maxScore', maxScore);
    data.set('minScore', minScore);

    const response = await fetch(`${API_BASE_URL}/tests`, {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  const { maxScore, minScore } = calculateMinMaxScores();

  return (
    <form onSubmit={createNewTest}>
      <h2>Test Oluştur</h2>
      <input
        type="text"
        placeholder="Test Başlığı"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Test Özeti"
        value={summary}
        rows={4}
        style={{ width: '100%', minHeight: '100px', resize: 'none' }}
        onChange={(e) => setSummary(e.target.value)}
      />
      <select
        value={selectedTags}
        onChange={(ev) => setSelectedTags(Array.from(ev.target.selectedOptions, (option) => option.value))}
      >
        {availableTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
      <input type="file" onChange={(e) => setFiles(e.target.files)} />
      <button type="button" style={{margin:'5px 0',background:'#8ccc6f'}} onClick={addQuestion}>Soru Ekle</button>
      {questions.map((question, qIndex) => (
        <div key={qIndex} style={{ marginTop: '40px', borderTop:'1px solid #444', paddingTop:'40px' }}>
          <input
            type="text"
            placeholder="Soru Metni"
            value={question.questionText}
            onChange={(e) => {
              const updatedQuestions = [...questions];
              updatedQuestions[qIndex].questionText = e.target.value;
              setQuestions(updatedQuestions);
            }}
          />
          <input
            type="text"
            placeholder="Soru Görsel URL"
            value={question.image}
            onChange={(e) => {
              const updatedQuestions = [...questions];
              updatedQuestions[qIndex].image = e.target.value;
              setQuestions(updatedQuestions);
            }}
          />
          <button type="button" style={{margin:'5px 0',background:'#f55656'}} onClick={() => removeQuestion(qIndex)}>Soruyu Sil</button>
          <button type="button" style={{margin:'5px 0',background:'#8ccc6f'}} onClick={() => addAnswer(qIndex)}>Cevap Ekle</button>
          {question.answers.map((answer, aIndex) => (
            <div key={aIndex} style={{ marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Cevap Metni"
                value={answer.answerText}
                onChange={(e) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[qIndex].answers[aIndex].answerText = e.target.value;
                  setQuestions(updatedQuestions);
                }}
              />
              <input
                type="number"
                placeholder="Puan"
                value={answer.score}
                onChange={(e) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[qIndex].answers[aIndex].score = Number(e.target.value);
                  setQuestions(updatedQuestions);
                }}
              />
              <button type="button" style={{margin:'5px 0',background:'#f55656'}} onClick={() => removeAnswer(qIndex, aIndex)}>Cevabı Sil</button>
            </div>
          ))}
        </div>
      ))}
      <h4>Max Puan: {maxScore}</h4>
      <h4>Min Puan: {minScore}</h4>
      <button type="button" style={{margin:'5px 0',background:'#8ccc6f'}} onClick={addResult}>Sonuç Ekle</button>
      {results.map((result, rIndex) => (
        <div key={rIndex} style={{ marginTop: '20px' }}>
          <button type="button" style={{margin:'5px 0',background:'#f55656'}} onClick={() => removeResult(rIndex)}>Sonucu Sil</button>
          <button type="button" style={{margin:'5px 0',background:'#8ccc6f'}} onClick={() => addCondition(rIndex)}>Koşul Ekle</button>
          {result.conditions.map((condition, cIndex) => (
            <div key={cIndex}>
              <select
                value={condition.operator}
                onChange={(e) => {
                  const updatedResults = [...results];
                  updatedResults[rIndex].conditions[cIndex].operator = e.target.value;
                  setResults(updatedResults);
                }}
              >
                <option value=">">{'>'}</option>
                <option value=">=">{'>='}</option>
                <option value="<">{'<'}</option>
                <option value="<=">{'<='}</option>
                <option value="=">{'='}</option>
              </select>
              <input
                type="number"
                placeholder="Puan"
                value={condition.value}
                onChange={(e) => {
                  const updatedResults = [...results];
                  updatedResults[rIndex].conditions[cIndex].value = Number(e.target.value);
                  setResults(updatedResults);
                }}
              />
              <button type="button" style={{margin:'5px 0',background:'#f55656'}} onClick={() => removeCondition(rIndex, cIndex)}>Koşulu Sil</button>
            </div>
          ))}
          <textarea
            placeholder="Sonuç Metni"
            value={result.resultText}
            onChange={(e) => {
              const updatedResults = [...results];
              updatedResults[rIndex].resultText = e.target.value;
              setResults(updatedResults);
            }}
          />
          <input
            type="text"
            placeholder="Sonuç Görsel URL"
            value={result.image}
            onChange={(e) => {
              const updatedResults = [...results];
              updatedResults[rIndex].image = e.target.value;
              setResults(updatedResults);
            }}
          />
        </div>
      ))}
      <button type="submit">Test Oluştur</button>
    </form>
  );
};


export default CreateTest;