import './App.css';
import ReactGA from "react-ga4";
import { UserContextProvider } from './Hooks/UserContext';
// import Aside from './components/Aside/Aside';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AppRoutes from './Routes/AppRoutes';
import Warning from './components/Warning/Warning';
import DarkMode from './components/DarkMode';
import CookieConsent from './components/CookieConsent';

ReactGA.initialize("G-L90S7CY9N9");

function App() {
  return (
    <UserContextProvider>
      <DarkMode />
      <main className="app">
        <Warning />
        <Header />
        <CookieConsent />
        {/* <Aside/> */}
        <div className="content">
          <AppRoutes />
        </div>
        <Footer />
      </main>
    </UserContextProvider>
  );
}

export default App;