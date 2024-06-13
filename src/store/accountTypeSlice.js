import {createSlice} from '@reduxjs/toolkit';

const accountTypeSlice = createSlice({
  name: 'accountTypeDetails',
  initialState: {
    accountTypeDetails: [],
    accountTypeLoading: true,
    documentTypeId: '',
  },
  reducers: {
    setAccountTypeDetails: (state, action) => {
      state.accountTypeDetails = action.payload;
    },
    setAccountTypeLoading: (state, action) => {
      state.accountTypeLoading = action.payload;
    },
    setDocumentTypeId: (state, action) => {
      state.documentTypeId = action.payload;
    },
  },
});

export const {setAccountTypeDetails, setDocumentTypeId, setAccountTypeLoading} =
  accountTypeSlice.actions;
export default accountTypeSlice.reducer;
