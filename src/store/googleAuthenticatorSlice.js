import {createSlice} from '@reduxjs/toolkit';
/**
 <---------------------------------------------------------------------------------------------->
 * Purpose: Add auth related data to redux
 * Created/Modified By: Sudhin Sudhakaran
 * Created/Modified Date: 25-05-2023
 * Steps:
 * 1.  get the values from the user
 * 2.   save to state
 <---------------------------------------------------------------------------------------------->
 */
const googleAuthenticatorSlice = createSlice({
  name: 'googleAuthenticator',
  initialState: {
    isAccountAdded: false,
    secretKey: null,
  },
  reducers: {
    setIsAccountAdded: (state, action) => {
      state.isAccountAdded = action.payload;
    },
    setSecretKey: (state, action) => {
      state.secretKey = action.payload;
    },
  },
});

export const {setIsAccountAdded, setSecretKey} =
  googleAuthenticatorSlice.actions;
export default googleAuthenticatorSlice.reducer;
