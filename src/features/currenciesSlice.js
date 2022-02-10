import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { queryCurrencies } from '../utils/apolloClient';
const initialState = {
  isLoadingCurrencies: false,
  isFailedToLoadCurrencies: false,
  currencies: {},
};
//Async actions
export const getCurrencies = createAsyncThunk(
  'currencies/getCurrencies',
  async () => {
    try {
      const currencies = await queryCurrencies();
      return currencies;
    } catch (error) {
      console.log('Backend not working');
    }
  }
);

const currenciesSlice = createSlice({
  name: 'currencies',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getCurrencies.pending, (state) => {
        state.isLoadingCurrencies = true;
        state.isFailedToLoadCurrencies = false;
      })
      .addCase(getCurrencies.rejected, (state) => {
        state.isLoadingCurrencies = false;
        state.isFailedToLoadCurrencies = true;
      })
      .addCase(getCurrencies.fulfilled, (state, action) => {
        state.isLoadingCurrencies = false;
        state.isFailedToLoadCurrencies = false;
        state.currencies = action.payload;
      }),
});

const currenciesReducer = currenciesSlice.reducer;

export default currenciesReducer;
