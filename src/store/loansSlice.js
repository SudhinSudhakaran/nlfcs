import {createSlice} from '@reduxjs/toolkit';

const loansSlice = createSlice({
  name: 'loansDetails',
  initialState: {
    loansDetails: [],
    loansLoading: true,
  },
  reducers: {
    setLoansDetails: (state, action) => {
      state.loansDetails = action.payload;
    },
    setLoansLoading: (state, action) => {
      state.loansLoading = action.payload;
    },
  },
});

export const {setLoansDetails, setLoansLoading} = loansSlice.actions;
export default loansSlice.reducer;
