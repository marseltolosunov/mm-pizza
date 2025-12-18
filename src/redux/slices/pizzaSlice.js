import { createSlice } from '@reduxjs/toolkit';
import pizzasData from '../../data/pizzas.json';

const initialState = {
  pizzas: pizzasData,
  selectedPizza: null,
  loading: false,
  filters: {
    category: 'все',
    priceRange: 'все',
    searchQuery: '',
    ingredients: [],
  },
};

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    setPizzas: (state, action) => {
      state.pizzas = action.payload;
    },
    setSelectedPizza: (state, action) => {
      state.selectedPizza = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCategory: (state, action) => {
      state.filters.category = action.payload;
    },
    setPriceRange: (state, action) => {
      state.filters.priceRange = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },
    toggleIngredient: (state, action) => {
      const ingredient = action.payload;
      const index = state.filters.ingredients.indexOf(ingredient);
      
      if (index > -1) {
        state.filters.ingredients.splice(index, 1);
      } else {
        state.filters.ingredients.push(ingredient);
      }
    },
    clearFilters: (state) => {
      state.filters = {
        category: 'все',
        priceRange: 'все',
        searchQuery: '',
        ingredients: [],
      };
    },
  },
});

export const {
  setPizzas,
  setSelectedPizza,
  setLoading,
  setCategory,
  setPriceRange,
  setSearchQuery,
  toggleIngredient,
  clearFilters,
} = pizzaSlice.actions;

export default pizzaSlice.reducer;