import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  cart: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProductToCart: {
      reducer: (state, action) => {
        const { id, product } = action.payload;
        state.cart[id] = product;
      },
      prepare: (product) => {
        const id = nanoid();
        product.count = 1;
        product.id = id;
        return { payload: { id, product } };
      },
    },
    changeCount: (state, action) => {
      const { id, change } = action.payload;
      state.cart[id].count += change;
    },
    deleteProduct: (state, action) => {
      const { id } = action.payload;
      const { [id]: willBeRemoved, ...newCart } = state.cart;
      state.cart = newCart;
    },
  },
});

const cartReducer = cartSlice.reducer;

export const { addProductToCart, changeCount, deleteProduct } =
  cartSlice.actions;

export default cartReducer;
