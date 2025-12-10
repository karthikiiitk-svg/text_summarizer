import { createSlice } from '@reduxjs/toolkit';

const summarySlice = createSlice({
  name: 'summary',
  initialState: {
    text: '',
    summary: '',
    loading: false,
    error: null,
  },
  reducers: {
    setText: (state, action) => {
      state.text = action.payload;
    },
    setSummary: (state, action) => {
      state.summary = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearSummary: (state) => {
      state.text = '';
      state.summary = '';
      state.error = null;
    },
  },
});

export const { setText, setSummary, setLoading, setError, clearSummary } = summarySlice.actions;
export default summarySlice.reducer;
