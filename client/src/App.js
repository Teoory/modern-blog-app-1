import './App.css';
import { UserContextProvider, UserContext } from './Hooks/UserContext';
import { useContext } from 'react';
// import Aside from './components/Aside/Aside';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AppRoutes from './Routes/AppRoutes';
import Warning from './components/Warning/Warning';
import DarkMode from './components/DarkMode';
import CookieConsent from './components/CookieConsent';
import SnowEffect from './components/Snow/SnowEffect';
import ReactGA from "react-ga4";

ReactGA.initialize('G-L90S7CY9N9');

function AppContent() {
  const { theme } = useContext(UserContext);

  return (
    <main className="app">
      <DarkMode />
      {theme === 'winter' && <SnowEffect />}
      <Warning />
      <Header />
      <CookieConsent />
      {/* <Aside/> */}
      <div className="content">
        <AppRoutes />
      </div>
      <Footer />
    </main>
  );
}

function App() {
  return (
    <UserContextProvider>
      <AppContent />
    </UserContextProvider>
  );
}

export default App;