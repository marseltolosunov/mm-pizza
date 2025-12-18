import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setCategory,
  setPriceRange,
  setSearchQuery,
  toggleIngredient,
  clearFilters,
} from '../redux/slices/pizzaSlice';

function PizzaFilters() {
  const dispatch = useDispatch();
  const { filters, pizzas } = useSelector((state) => state.pizza);

  // Получаем уникальные категории
  const categories = ['все', ...new Set(pizzas.map(p => p.category))];

  // Получаем уникальные ингредиенты
  const allIngredients = [...new Set(pizzas.flatMap(p => p.ingredients))];

  // Ценовые диапазоны
  const priceRanges = [
    { value: 'все', label: 'Все цены' },
    { value: 'budget', label: 'До 500₽' },
    { value: 'medium', label: '500₽ - 600₽' },
    { value: 'premium', label: 'От 600₽' },
  ];

  const handleCategoryChange = (e) => {
    dispatch(setCategory(e.target.value));
  };

  const handlePriceRangeChange = (e) => {
    dispatch(setPriceRange(e.target.value));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleIngredientToggle = (ingredient) => {
    dispatch(toggleIngredient(ingredient));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const activeFiltersCount = 
    (filters.category !== 'все' ? 1 : 0) +
    (filters.priceRange !== 'все' ? 1 : 0) +
    (filters.searchQuery !== '' ? 1 : 0) +
    filters.ingredients.length;

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h2>🔍 Фильтры</h2>
        {activeFiltersCount > 0 && (
          <button className="btn-clear-filters" onClick={handleClearFilters}>
            Сбросить ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Поиск */}
      <div className="filter-section">
        <label className="filter-label">Поиск по названию</label>
        <input
          type="text"
          className="filter-search"
          placeholder="Найти пиццу..."
          value={filters.searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Категория */}
      <div className="filter-section">
        <label className="filter-label">Категория</label>
        <select
          className="filter-select"
          value={filters.category}
          onChange={handleCategoryChange}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'все' ? 'Все категории' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Ценовой диапазон */}
      <div className="filter-section">
        <label className="filter-label">Цена</label>
        <select
          className="filter-select"
          value={filters.priceRange}
          onChange={handlePriceRangeChange}
        >
          {priceRanges.map(range => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Ингредиенты */}
      <div className="filter-section">
        <label className="filter-label">Ингредиенты</label>
        <div className="ingredients-filter">
          {allIngredients.map(ingredient => (
            <label key={ingredient} className="ingredient-checkbox">
              <input
                type="checkbox"
                checked={filters.ingredients.includes(ingredient)}
                onChange={() => handleIngredientToggle(ingredient)}
              />
              <span>{ingredient}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PizzaFilters;