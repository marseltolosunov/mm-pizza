import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoading, setSelectedPizza } from '../redux/slices/pizzaSlice';
import { addToFavorites, removeFromFavorites } from '../redux/slices/favoritesSlice';
import PizzaFilters from '../components/PizzaFilters';

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pizzas, loading, filters } = useSelector((state) => state.pizza);
  const { favorites } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 1000);
  }, [dispatch]);

  const handlePizzaClick = (pizza) => {
    dispatch(setSelectedPizza(pizza));
    navigate(`/pizza/${pizza.id}`);
  };

  const isFavorite = (pizzaId) => {
    return favorites.some(fav => fav.id === pizzaId);
  };

  const toggleFavorite = (e, pizza) => {
    e.stopPropagation();
    
    if (isFavorite(pizza.id)) {
      dispatch(removeFromFavorites(pizza.id));
    } else {
      dispatch(addToFavorites(pizza));
    }
  };

  // Фильтрация пицц
  const filteredPizzas = useMemo(() => {
    let result = [...pizzas];

    // Фильтр по категории
    if (filters.category !== 'все') {
      result = result.filter(pizza => pizza.category === filters.category);
    }

    // Фильтр по цене
    if (filters.priceRange !== 'все') {
      switch (filters.priceRange) {
        case 'budget':
          result = result.filter(pizza => pizza.price < 500);
          break;
        case 'medium':
          result = result.filter(pizza => pizza.price >= 500 && pizza.price < 600);
          break;
        case 'premium':
          result = result.filter(pizza => pizza.price >= 600);
          break;
        default:
          break;
      }
    }

    // Фильтр по поиску
    if (filters.searchQuery.trim() !== '') {
      result = result.filter(pizza =>
        pizza.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        pizza.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Фильтр по ингредиентам
    if (filters.ingredients.length > 0) {
      result = result.filter(pizza =>
        filters.ingredients.every(ingredient =>
          pizza.ingredients.includes(ingredient)
        )
      );
    }

    return result;
  }, [pizzas, filters]);

  if (loading) {
    return <div className="loading">Загрузка меню</div>;
  }

  return (
    <div>
      {/* Hero секция */}
      <section className="hero">
        <div className="hero-content">
          <h1>🍕 M&M Pizza 🍕</h1>
          <p>Лучшая пицца в городе!</p>
        </div>
      </section>

      {/* Статистика */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Лет на рынке</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Видов пиццы</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Довольных клиентов</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">30</div>
            <div className="stat-label">Минут доставка</div>
          </div>
        </div>
      </section>

      {/* Основной контент с фильтрами */}
      <div className="container">
        <h2 className="section-title">Наше меню</h2>
        
        <div className="menu-with-filters">
          {/* Боковая панель фильтров */}
          <aside className="filters-sidebar">
            <PizzaFilters />
          </aside>

          {/* Список пицц */}
          <div className="pizzas-content">
            <div className="pizzas-header">
              <p className="pizzas-count">
                Найдено пицц: <strong>{filteredPizzas.length}</strong>
              </p>
            </div>

            {filteredPizzas.length === 0 ? (
              <div className="no-pizzas">
                <h3>😔 Ничего не найдено</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
              </div>
            ) : (
              <div className="pizza-grid">
                {filteredPizzas.map((pizza, index) => (
                  <div 
                    key={pizza.id} 
                    className="pizza-card"
                    style={{'--card-index': index}}
                    onClick={() => handlePizzaClick(pizza)}
                  >
                    <button 
                      className={`favorite-btn ${isFavorite(pizza.id) ? 'active' : ''}`}
                      onClick={(e) => toggleFavorite(e, pizza)}
                      title={isFavorite(pizza.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
                    >
                      {isFavorite(pizza.id) ? '❤️' : '🤍'}
                    </button>

                    <img 
                      src={pizza.image} 
                      alt={pizza.name} 
                      className="pizza-image"
                    />
                    <div className="pizza-info">
                      <h3>{pizza.name}</h3>
                      <p>{pizza.description}</p>
                      <div className="pizza-price">{pizza.price} ₽</div>
                      
                      {/* Ингредиенты */}
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;