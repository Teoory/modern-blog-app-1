import './App.css';
import { UserContextProvider } from './Hooks/UserContext';
import Aside from './components/Aside/Aside';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AppRoutes from './Routes/AppRoutes';
import Warning from './components/Warning/Warning';

function App() {
  return (
    <UserContextProvider>
      <main className="app">
        <Warning />
        <Header />
        <Aside/>
        <AppRoutes />
        <Footer />
      </main>
    </UserContextProvider>
  );
}

export default App;