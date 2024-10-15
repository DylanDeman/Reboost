import { Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <h1>Welkom!</h1>
      <p>Kies één van de volgende links:</p>
      <ul>
        <li>
          <Link to='/evenementen'>Evenementen</Link> {/* 👈 */}
        </li>
      </ul>
    </div>
  );
}

export default App;
