import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addToFavorites, removeFromFavorites } from '../redux/slices/favoritesSlice';

function PizzaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pizzas } = useSelector((state) => state.pizza);
  const { favorites } = useSelector((state) => state.favorites);
  const [pizza, setPizza] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('medium');

  useEffect(() => {
    const foundPizza = pizzas.find(p => p.id === parseInt(id));
    if (foundPizza) {
      setPizza(foundPizza);
    } else {
      navigate('/');
    }
  }, [id, pizzas, navigate]);

  const isFavorite = () => {
    return pizza && favorites.some(fav => fav.id === pizza.id);
  };

  const toggleFavorite = () => {
    if (isFavorite()) {
      dispatch(removeFromFavorites(pizza.id));
    } else {
      dispatch(addToFavorites(pizza));
    }
  };

  if (!pizza) {
    return <div className="loading">Загрузка...</div>;
  }

  const sizes = {
    small: { name: 'Маленькая (25см)', price: pizza.price - 100 },
    medium: { name: 'Средняя (30см)', price: pizza.price },
    large: { name: 'Большая (35см)', price: pizza.price + 150 },
  };

  const totalPrice = sizes[selectedSize].price * quantity;

  return (
    <div className="detail-page">
      <div className="detail-container">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Назад к меню
        </button>

        <div className="detail-content">
          <div className="detail-image-section">
            <img 
              src={pizza.image} 
              alt={pizza.name} 
              className="detail-image"
            />
          </div>

          <div className="detail-info-section">
            <div className="detail-header">
              <h1 className="detail-title">{pizza.name}</h1>
              <button 
                className={`favorite-btn-large ${isFavorite() ? 'active' : ''}`}
                onClick={toggleFavorite}
                title={isFavorite() ? 'Удалить из избранного' : 'Добавить в избранное'}
              >
                {isFavorite() ? '❤️' : '🤍'}
              </button>
            </div>

            <p className="detail-category">Категория: {pizza.category}</p>
            <p className="detail-description">{pizza.description}</p>

            <div className="detail-ingredients">
              <h3>Состав:</h3>
              <ul>
                {pizza.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="size-selector">
              <h3>Выберите размер:</h3>
              <div className="size-options">
                {Object.keys(sizes).map(size => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    <div>{sizes[size].name}</div>
                    <div className="size-price">{sizes[size].price} ₽</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="quantity-selector">
              <h3>Количество:</h3>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="detail-total">
              <div className="total-label">Итого:</div>
              <div className="total-price">{totalPrice} ₽</div>
            </div>

            <button className="btn btn-primary btn-add-cart">
              Добавить в корзину
            </button>
          </div>
        </div>

        <div className="related-pizzas">
          <h2>Вам также может понравиться</h2>
          <div className="related-grid">
            {pizzas
              .filter(p => p.id !== pizza.id && p.category === pizza.category)
              .slice(0, 3)
              .map(relatedPizza => (
                <div 
                  key={relatedPizza.id}
                  className="related-card"
                  onClick={() => navigate(`/pizza/${relatedPizza.id}`)}
                >
                  <img src={relatedPizza.image} alt={relatedPizza.name} />
                  <h4>{relatedPizza.name}</h4>
                  <p>{relatedPizza.price} ₽</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PizzaDetailPage;