import {createSlice} from '@reduxjs/toolkit';

const serviceSlicer = createSlice({
  name: 'slice',
  initialState: {
    selectedService: [],
    allService: null,
  },

  reducers: {
    setService: (state, action) => {
      state.selectedService = [...state.selectedService, action.payload];
    },
    allService: (state, action) => {
      state.allService = action.payload;
    },
    clearService: (state, action) => {
      state.selectedService = [];
    },
  },
});

export const {setService, allService, clearService} = serviceSlicer.actions;

export default serviceSlicer.reducer;
