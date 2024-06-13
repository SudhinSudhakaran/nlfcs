import {createSlice} from '@reduxjs/toolkit';
const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    isAuthorized: false,
  },
  reducers: {
    setIsAuthorized: (state,action) => {
      state.isAuthorized = action.payload;
    },
  },
});

export const {setIsAuthorized} = authenticationSlice.actions;
export default authenticationSlice.reducer;
