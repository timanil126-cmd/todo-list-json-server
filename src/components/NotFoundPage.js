import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <div className="not-found">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Страница не найдена</h2>
          <p>Извините, запрашиваемая страница не существует.</p>
          <button onClick={handleGoHome} className="home-button">
            Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;