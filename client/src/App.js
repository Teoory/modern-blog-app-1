import './App.css';
import { UserContextProvider } from './Hooks/UserContext';
import DefRoutes from './Routes/DefRoutes';
// import Aside from './components/Aside/Aside';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <UserContextProvider>
      <main className="app">
        <Header/>
        <DefRoutes/>
        {/* <Aside/> */}
      </main>
        <Footer/>
    </UserContextProvider>
  );
}

export default App;