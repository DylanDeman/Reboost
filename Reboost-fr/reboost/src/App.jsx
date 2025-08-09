import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/Theme.context';
import Navbar from './components/navbar';
import TooltipInitializer from './components/TooltipInitializer';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <TooltipInitializer />
        <Navbar />
        <div className="container mt-4">
          <h1>Welkom!</h1>
          <p>Kies één van de volgende links:</p>
          <ul>
            <li>
              <NavLink to='/evenementen'>Evenementen</NavLink>
            </li>
            <li>
              <NavLink to='/plaatsen'>Plaatsen</NavLink>
            </li>
          </ul>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
