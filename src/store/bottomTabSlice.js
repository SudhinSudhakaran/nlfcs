import {createSlice} from '@reduxjs/toolkit';

const bottomTabSlice = createSlice({
  name: 'bottomTab',
  initialState: {
    announcementTab: false,
    documentTab: false,
    depositTab: false,
    dashboardTab: false,
    faqTab: false,
  },
  reducers: {
    setAnnouncementTab: (state, action) => {
      state.announcementTab = action.payload;
    },
    setDocumentTab: (state, action) => {
      state.documentTab = action.payload;
    },
    setDepositTab: (state, action) => {
      state.depositTab = action.payload;
    },
    setDashboardTab: (state, action) => {
      state.dashboardTab = action.payload;
    },
    setFAQTab: (state, action) => {
      state.faqTab = action.payload;
    },
  },
});

export const {
  setAnnouncementTab,
  setDocumentTab,
  setDepositTab,
  setDashboardTab,
  setFAQTab,
} = bottomTabSlice.actions;
export default bottomTabSlice.reducer;
