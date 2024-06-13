import {createSlice} from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notificationDetails',
  initialState: {
    notificationDetails: [],
    notificationLoading: true,
    notificationUnReadCount: [],
    showUnreadCount: false,
  },
  reducers: {
    setNotificationDetails: (state, action) => {
      state.notificationDetails = action.payload;
    },
    setNotificationUnReadCount: (state, action) => {
      state.notificationUnReadCount = action.payload;
    },
    setNotificationLoading: (state, action) => {
      state.notificationLoading = action.payload;
    },
    setNotificationRefresh: (state, action) => {
      console.log('refresg action', action.payload);
      state.showUnreadCount = action.payload;
    },
  },
});

export const {
  setNotificationDetails,
  setNotificationLoading,
  setNotificationUnReadCount,
  setNotificationRefresh,
} = notificationSlice.actions;
export default notificationSlice.reducer;
