import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { queryProducts, queryProduct } from '../utils/apolloClient';

const initialState = {
  isLoadingProducts: false,
  isFailedToLoadProducts: false,
  isLoadingProduct: false,
  isFailedToLoadProduct: false,
  products: {},
  product: {},
};

//Async actions

export const getProducts = createAsyncThunk(
  'products/getProducts',
  async () => {
    try {
      const products = await queryProducts();
      const newProductsObject = {};
      products.forEach((product) => {
        newProductsObject[product.category] = {
          ...newProductsObject[product.category],
          [product.id]: product,
        };
      });
      return newProductsObject;
    } catch (error) {
      console.log('Backend not working =(');
    }
  }
);

export const getProduct = createAsyncThunk(
  'products/getProduct',
  async (productId) => {
    try {
      const product = await queryProduct(productId);
      return product;
    } catch (error) {
      console.log(error);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoadingProducts = true;
        state.isFailedToLoadProducts = false;
      })
      .addCase(getProducts.rejected, (state) => {
        state.isLoadingProducts = false;
        state.isFailedToLoadProducts = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoadingProducts = false;
        state.isFailedToLoadProducts = false;
        state.products = action.payload;
      })
      .addCase(getProduct.pending, (state) => {
        state.isLoadingProduct = true;
        state.isFailedToLoadProduct = false;
      })
      .addCase(getProduct.rejected, (state) => {
        state.isLoadingProduct = false;
        state.isFailedToLoadProduct = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoadingProduct = false;
        state.isFailedToLoadProduct = false;
        state.product = action.payload;
      });
  },
});

const productsReducer = productsSlice.reducer;
export default productsReducer;
