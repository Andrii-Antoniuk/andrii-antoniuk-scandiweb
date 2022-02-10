import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { queryCategories } from '../utils/apolloClient';

const initialState = {
  isLoadingCategories: false,
  isFailedToLoadCategories: false,
  categories: {
    names: [],
  },
};

//Async actions
export const getCategoriesNames = createAsyncThunk(
  'categories/getCategoriesNames',
  async () => {
    try {
      const categories = await queryCategories();
      return categories;
    } catch (error) {
      console.log('Backend is not working');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getCategoriesNames.pending, (state) => {
        state.isLoadingCategories = true;
        state.isFailedToLoadCategories = false;
      })
      .addCase(getCategoriesNames.rejected, (state) => {
        state.isLoadingCategories = false;
        state.isFailedToLoadCategories = true;
      })
      .addCase(getCategoriesNames.fulfilled, (state, action) => {
        state.isLoadingCategories = false;
        state.isFailedToLoadCategories = false;
        state.categories.names = action.payload;
      }),
});

const categoriesReducer = categoriesSlice.reducer;

export default categoriesReducer;
