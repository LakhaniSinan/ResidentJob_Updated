import {createSlice} from '@reduxjs/toolkit';
import {getAllNotificationById} from '../../services/notification';

export const initialState = {
  notificationLoading: false,
  hasErrors: false,
  notificationList: [],
  selectedNotification: null,
};

const NotificationSlice = createSlice({
  name: 'notificationList',
  initialState,
  reducers: {
    getNotificationInitial: state => {
      state.notificationLoading = true;
    },
    getNotificationSuccess: (state, {payload}) => {
      state.notificationList = payload;
      state.notificationLoading = false;
      state.hasErrors = false;
    },
    getNotificationFailure: (state, {payload}) => {
      state.notificationLoading = false;
      state.hasErrors = payload;
    },
    setSelectedNotification: (state, {payload}) => {
      state.selectedNotification = payload;
    },
  },
});

export const {
  getNotificationInitial,
  getNotificationSuccess,
  getNotificationFailure,
  setSelectedNotification,
} = NotificationSlice.actions;

export default NotificationSlice.reducer;

export function handleGetAllNotification(userId) {
  return dispatch => {
    dispatch(getNotificationInitial());
    getAllNotificationById(userId)
      .then(async response => {
        if (response?.status == 200 || response?.status == 201) {
          let data = response?.data?.data;

          await dispatch(getNotificationSuccess(data));
        } else {
          dispatch(getNotificationFailure(response?.data?.message));
        }
      })
      .catch(error => {
        dispatch(getNotificationFailure(error));
      });
  };
}
