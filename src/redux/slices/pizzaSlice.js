import { createSlice } from '@reduxjs/toolkit';
import pizzasData from '../../data/pizzas.json';

const initialState = {
  pizzas: pizzasData,
  selectedPizza: null,
  loading: false,
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
  },
});

export const { setPizzas, setSelectedPizza, setLoading } = pizzaSlice.actions;
export default pizzaSlice.reducer;