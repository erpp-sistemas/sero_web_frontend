import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
// Combina tus reductores en un reductor raíz
const rootReducer = combineReducers({
  //* Slices
});

const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage,
  whitelist: [''],
};
const persistedRootReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedRootReducer,
  middleware: [thunk]
});
export default store;

export type StoreDispatch = typeof store.dispatch;
export type StoreState = ReturnType<typeof rootReducer>; 

export const { dispatch } = store;
export const persistor = persistStore(store);
export const getState = () => store.getState() as StoreState;

//* Dependecias => npm i redux redux-thunk redux-persist @reduxjs/toolkit