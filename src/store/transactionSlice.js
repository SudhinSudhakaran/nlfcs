import {createSlice} from '@reduxjs/toolkit';

const transactionSlice = createSlice({
  name: 'transactionDetails',
  initialState: {
    transactionDetails: [],
    transactionLoading: true,
  },
  reducers: {
    setTransactionDetails: (state, action) => {
      state.transactionDetails = action.payload;
    },
    setTransactionLoading: (state, action) => {
      state.transactionLoading = action.payload;
    },
  },
});

export const {setTransactionDetails, setTransactionLoading} = transactionSlice.actions;
export default transactionSlice.reducer;
