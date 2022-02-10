import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  active: {
    page: '',
    currency: '',
    productId: '',
    category: '',
  },
};

const activeSlice = createSlice({
  name: 'active',
  initialState,
  reducers: {
    changeActivePage(state, action) {
      state.active.page = action.payload;
    },
    changeActiveCurrency(state, action) {
      state.active.currency = action.payload;
    },
    changeActiveProduct(state, action) {
      state.active.productId = action.payload;
    },
    changeActiveCategory(state, action) {
      state.active.category = action.payload;
    },
  },
});

export const {
  changeActiveCurrency,
  changeActivePage,
  changeActiveProduct,
  changeActiveCategory,
} = activeSlice.actions;
const activeReducer = activeSlice.reducer;
export default activeReducer;
