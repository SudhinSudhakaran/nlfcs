import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userDetails',
  initialState: {
    userDetails: {},
    memberLoading: true,
    userPassword: null,
    shareDetails: {},
    temptoken: '',
    fullinfo: {},
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    setFullInfo: (state, action) => {
      state.fullinfo = action.payload;
    },
    setShareDetails: (state, action) => {
      state.shareDetails = action.payload;
    },
    setMemberLoading: (state, action) => {
      state.memberLoading = action.payload;
    },
    setTempToken: (state, action) => {
      state.temptoken = action.payload;
    },
    setUserPassword: (state, action) => {
      state.userPassword = action.payload;
    },
  },
});

export const {
  setUserDetails,
  setShareDetails,
  setMemberLoading,
  setUserPassword,
  setTempToken,
  setFullInfo,
} = userSlice.actions;
export default userSlice.reducer;
