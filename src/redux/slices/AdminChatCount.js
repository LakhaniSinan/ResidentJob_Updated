import {createSlice} from '@reduxjs/toolkit';

export const AdminChatCount = createSlice({
  name: 'AdminChatCount',
  initialState: {
    chatCount: 0,
  },
  reducers: {
    setChatCount: (state, action) => {
      state.chatCount = action.payload;
    },
  },
});

export const {setChatCount} = AdminChatCount.actions;

export default AdminChatCount.reducer;
