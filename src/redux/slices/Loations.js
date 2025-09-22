import {createSlice} from '@reduxjs/toolkit';

export const userLocationSlice = createSlice({
  name: 'userLocation',
  initialState: {
    userLocation: null,
  },
  reducers: {
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
  },
});

export const {setUserLocation} = userLocationSlice.actions;

export default userLocationSlice.reducer;
