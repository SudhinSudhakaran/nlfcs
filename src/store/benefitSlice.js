import {createSlice} from '@reduxjs/toolkit';

const benefitSlice = createSlice({
  name: 'benefitDetails',
  initialState: {
    benefitDetails: [],
    benefitLoading: true,
  },
  reducers: {
    setBenefitDetails: (state, action) => {
      state.benefitDetails = action.payload;
    },
    setBenefitLoading: (state, action) => {
      state.benefitLoading = action.payload;
    },
  },
});

export const {setBenefitDetails, setBenefitLoading} = benefitSlice.actions;
export default benefitSlice.reducer;
