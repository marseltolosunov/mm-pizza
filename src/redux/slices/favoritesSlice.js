import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const pizza = action.payload;
      const exists = state.favorites.find(item => item.id === pizza.id);
      
      if (!exists) {
        state.favorites.push(pizza);
      }
    },
    removeFromFavorites: (state, action) => {
      const pizzaId = action.payload;
      state.favorites = state.favorites.filter(item => item.id !== pizzaId);
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;