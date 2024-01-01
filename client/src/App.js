import './App.css';
import { UserContextProvider } from './Hooks/UserContext';
import DefRoutes from './Routes/DefRoutes';
import Header from './components/Header/Header';

function App() {
  return (
    <UserContextProvider>
      <main className="app">
        <Header/>
        <DefRoutes/>
      </main>
    </UserContextProvider>
  );
}

export default App;