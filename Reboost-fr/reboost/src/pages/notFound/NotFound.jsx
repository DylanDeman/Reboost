// src/pages/NotFound.jsx
import { useLocation, useNavigate } from 'react-router-dom'; // 👈

const NotFound = () => {
  const navigate = useNavigate(); // 👈
  const { pathname } = useLocation();

  // 👇
  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div>
      <h1>Pagina niet gevonden</h1>
      <p>Er is geen pagina met als url {pathname}, probeer iets anders.</p>
      {/* 👇 */}
      <button onClick={handleGoHome}>Go home!</button>
    </div>
  );
};

export default NotFound;
