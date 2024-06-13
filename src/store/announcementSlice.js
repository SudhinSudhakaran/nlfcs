import {createSlice} from '@reduxjs/toolkit';

const announcementSlice = createSlice({
  name: 'announcementDetails',
  initialState: {
    announcementDetails: [],
    announcementLoading: true,
  },
  reducers: {
    setAnnouncementDetails: (state, action) => {
      state.announcementDetails = action.payload;
    },
    setAnnouncementLoading: (state, action) => {
      state.announcementLoading = action.payload;
    },
  },
});

export const {setAnnouncementDetails, setAnnouncementLoading} =
  announcementSlice.actions;
export default announcementSlice.reducer;
