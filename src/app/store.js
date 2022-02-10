import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cartSlice';
import productsReducer from '../features/productsSlice';
import currenciesReducer from '../features/currenciesSlice';
import activeReducer from '../features/activeSlice';
import categoriesReducer from '../features/categoriesSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    currencies: currenciesReducer,
    products: productsReducer,
    categories: categoriesReducer,
    active: activeReducer,
  },
});
