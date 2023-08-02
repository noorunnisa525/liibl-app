import {configureStore} from '@reduxjs/toolkit';
import {persistStore} from 'redux-persist';
import {apiHandler} from '../../services/service';
import rootReducer from '../slices/index';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiHandler.middleware),
});

export const persistor = persistStore(store);
