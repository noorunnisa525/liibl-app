import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import {apiHandler} from '../../services/service';
import userReducer from './userSlice';
import stripeSlice from './stripeSlice';
import serviceReducer from './serviceSlice';

const rootReducer = combineReducers({
  user: userReducer,
  service: serviceReducer,
  stripe: stripeSlice,
  [apiHandler.reducerPath]: apiHandler.reducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'],
  timeout: null,
};

const root = (state, action) => {
  return persistedReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default root;
