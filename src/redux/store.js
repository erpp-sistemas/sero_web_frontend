import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from '../redux/reducers'

const persistConfig = {
	key: 'root', 
	storage, 
	whitelist: ['user', 'place']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		immutableCheck: false,
		serializableCheck: false,
	})
})

const persistor = persistStore(store)

export { store, persistor }
export const {dispatch}=store