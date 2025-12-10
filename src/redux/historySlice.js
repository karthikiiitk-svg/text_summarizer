import { createSlice } from '@reduxjs/toolkit';

const historySlice = createSlice({
  name: 'history',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setHistory: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addToHistory: (state, action) => {
      state.items.unshift(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { setHistory, addToHistory, setLoading, setError, deleteItem } = historySlice.actions;
export default historySlice.reducer;
