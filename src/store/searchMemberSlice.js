import {createSlice} from '@reduxjs/toolkit';

const searchMemberSlice = createSlice({
  name: 'searchMemberDetails',
  initialState: {
    searchMemberDetails: [],
    searchMemberLoading: true,
    documentImage: [],
  },
  reducers: {
    setSearchMemberDetails: (state, action) => {
      state.searchMemberDetails = action.payload;
    },
    setSearchMemberLoading: (state, action) => {
      state.searchMemberLoading = action.payload;
    },
    setDocumentImage: (state, action) => {
      state.documentImage = action.payload;
    },
  },
});

export const {
  setSearchMemberLoading,
  setDocumentImage,
  setSearchMemberDetails,
} = searchMemberSlice.actions;
export default searchMemberSlice.reducer;
