import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import documentReducer from './slices/documentSlice';
import templateReducer from './slices/templateSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    documents: documentReducer,
    templates: templateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
