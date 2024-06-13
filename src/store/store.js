import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tabSlice from './tabSlice';
import googleAuthenticatorSlice from './googleAuthenticatorSlice';
import userSlice from './userSlice';
import transactionSlice from './transactionSlice';
import benefitSlice from './benefitSlice';
import loansSlice from './loansSlice';
import accountTypeSlice from './accountTypeSlice';
import searchMemberSlice from './searchMemberSlice';
import documentSlice from './documentSlice';
import announcementSlice from './announcementSlice';
import notificationSlice from './notificationSlice';
import myTicketSlice from './myTicketSlice';
import fdrSlice from './fdrSlice';
import bottomTabSlice from './bottomTabSlice';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  tab: tabSlice,
  userDetails: userSlice,
  bottomTab: bottomTabSlice,
  searchMemberDetails: searchMemberSlice,
  transactionDetails: transactionSlice,
  fdrDetails: fdrSlice,
  accountTypeDetails: accountTypeSlice,
  benefitDetails: benefitSlice,
  myTicketsDetails: myTicketSlice,
  documentDetails: documentSlice,
  notificationDetails: notificationSlice,
  announcementDetails: announcementSlice,
  loansDetails: loansSlice,
  googleAuthenticator: googleAuthenticatorSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export default store;
