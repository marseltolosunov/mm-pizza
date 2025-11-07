import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromFavorites, clearFavorites } from '../redux/slices/favoritesSlice';

function FavoritesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { favorites } = useSelector((state) => state.favorites);

  const handleRemove = (pizzaId) => {
    dispatch(removeFromFavorites(pizzaId));
  };

  const handleClearAll = () => {
    if (window.confirm('Вы уверены, что хотите очистить все избранное?')) {
      dispatch(clearFavorites());
    }
  };

  const handlePizzaClick = (pizzaId) => {
    navigate(`/pizza/${pizzaId}`);
  };

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <div className="empty-content">
          <h1>💔 Избранное пусто</h1>
          <p>Вы еще не добавили ни одной пиццы в избранное</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Перейти к меню
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="container">
        <div className="favorites-header">
          <h1 className="section-title">❤️ Избранное ({favorites.length})</h1>
          <button 
            className="btn btn-clear"
            onClick={handleClearAll}
          >
            Очистить все
          </button>
        </div>

        <div className="favorites-grid">
          {favorites.map((pizza, index) => (
            <div 
              key={pizza.id} 
              className="favorite-card"
              style={{'--card-index': index}}
            >
              <button 
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(pizza.id);
                }}
                title="Удалить из избранного"
              >
                ✕
              </button>

              <div onClick={() => handlePizzaClick(pizza.id)}>
                <img 
                  src={pizza.image} 
                  alt={pizza.name} 
                  className="pizza-image"
                />
                <div className="pizza-info">
                  <h3>{pizza.name}</h3>
                  <p>{pizza.description}</p>
                  <div className="pizza-price">{pizza.price} ₽</div>
                  
                  <div className="ingredients">
                    <div className="ingredients-title">Состав:</div>
                    <div className="ingredients-list">
                      {pizza.ingredients.map((ingredient, idx) => (
                        <span key={idx} className="ingredient-tag">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="btn btn-primary" style={{marginTop: '15px', width: '100%'}}>
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FavoritesPage;