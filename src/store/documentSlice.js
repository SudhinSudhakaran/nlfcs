import {createSlice} from '@reduxjs/toolkit';

const documentSlice = createSlice({
  name: 'documentDetails',
  initialState: {
    documentDetails: [],
    documentLoading: true,
  },
  reducers: {
    setDocumentDetails: (state, action) => {
      state.documentDetails = action.payload;
    },
    setDocumentLoading: (state, action) => {
      state.documentLoading = action.payload;
    },
  },
});

export const {setDocumentDetails, setDocumentLoading} = documentSlice.actions;
export default documentSlice.reducer;
