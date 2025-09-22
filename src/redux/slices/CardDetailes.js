import {createSlice} from '@reduxjs/toolkit';

export const CardDetails = createSlice({
  name: 'cardDetails',
  initialState: {
    cardDetails: null,
  },
  reducers: {
    setCardDetails: (state, action) => {
      state.cardDetails = action.payload;
    },
  },
});

export const {setCardDetails} = CardDetails.actions;

export default CardDetails.reducer;
