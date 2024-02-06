import './App.css';
import { UserContextProvider } from './Hooks/UserContext';
import Aside from './components/Aside/Aside';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AppRoutes from './Routes/AppRoutes';
import Warning from './components/Warning/Warning';
import DarkMode from './components/DarkMode';

function App() {
  return (
    <UserContextProvider>
      <DarkMode />
      <main className="app">
        <Warning />
        <Header />
        <Aside/>
        <div className="content">
          <AppRoutes />
        </div>
        <Footer />
      </main>
    </UserContextProvider>
  );
}

export default App;