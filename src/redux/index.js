import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';
import CartDetailesSlice from './slices/CardDetailes';
import LoginSlice, {setUserData} from './slices/Login';
import AdminChatCount, {setChatCount} from './slices/AdminChatCount';
import NotificationSlice, {
  handleGetAllNotification,
} from './slices/Notification';

const rootReducer = combineReducers({
  LoginSlice,
  CartDetailesSlice,
  NotificationSlice,
  AdminChatCount,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk,
      serializableCheck: false,
    }),
});

const getUserData = async () => {
  let dataa = await AsyncStorage.getItem('userData');
  let count = await AsyncStorage.getItem('msg-count');
  count = JSON.parse(count);
  dataa = JSON.parse(dataa);
  store.dispatch(setUserData(dataa ? dataa : null));
  if (dataa) {
    store.dispatch(handleGetAllNotification(dataa?.userDetails?._id));
    store.dispatch(setChatCount(Number(count)));
  }
};
getUserData();

export default store;
