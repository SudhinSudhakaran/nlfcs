import {createSlice} from '@reduxjs/toolkit';

const fdrSlice = createSlice({
  name: 'fdrDetails',
  initialState: {
    fdrDetails: [],
    fdrLoading: true,
  },
  reducers: {
    setFdrDetails: (state, action) => {
      state.fdrDetails = action.payload;
    },
    setFdrLoading: (state, action) => {
      state.fdrLoading = action.payload;
    },
  },
});

export const {setFdrDetails, setFdrLoading} = fdrSlice.actions;
export default fdrSlice.reducer;
