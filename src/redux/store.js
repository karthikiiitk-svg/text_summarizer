import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import summaryReducer from './summarySlice';
import historyReducer from './historySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    summary: summaryReducer,
    history: historyReducer,
  },
});
