import {createSlice} from '@reduxjs/toolkit';

const myTicketSlice = createSlice({
  name: 'myTicketsDetails',
  initialState: {
    myTicketsDetails: [],
    myTicketsPendingDetails: [],
    myTicketsClosedDetails: [],
    myTicketsLoading: true,
  },
  reducers: {
    setMyTicketsDetails: (state, action) => {
      state.myTicketsDetails = action.payload;
    },
    setMyTicketsPendingDetails: (state, action) => {
      state.myTicketsPendingDetails = action.payload;
    },
    setMyTicketsClosedDetails: (state, action) => {
      state.myTicketsClosedDetails = action.payload;
    },
    setMyTicketsLoading: (state, action) => {
      state.myTicketsLoading = action.payload;
    },
  },
});

export const {
  setMyTicketsDetails,
  setMyTicketsLoading,
  setMyTicketsPendingDetails,
  setMyTicketsClosedDetails,
} = myTicketSlice.actions;
export default myTicketSlice.reducer;
