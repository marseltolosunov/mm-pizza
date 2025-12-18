import { configureStore } from '@reduxjs/toolkit';
import pizzaReducer from './slices/pizzaSlice';
import favoritesReducer from './slices/favoritesSlice';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import { authMiddleware } from './middleware/authMiddleware';

export const store = configureStore({
  reducer: {
    pizza: pizzaReducer,
    favorites: favoritesReducer,
    auth: authReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});