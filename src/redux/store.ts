import { AnyAction, combineReducers, createStore, Reducer, ReducersMapObject } from "redux";
// import { configureStore } from '@reduxjs/toolkit'
import { StoreModel } from "./storeModel";
import { reducer as OrdersReducer } from './orders/reducer';
import { reducer as ActiceCurrencyReducer } from './active-currency/reducer';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const reducers: ReducersMapObject<StoreModel, AnyAction> = {
    orders: OrdersReducer as Reducer<StoreModel['orders'], AnyAction>,
    activeCurrency: ActiceCurrencyReducer as Reducer<StoreModel['activeCurrency'], AnyAction>,
}

const combinedReducers = combineReducers(reducers);

const persistConfig = {
    key: 'root',
    storage
};

const persistedCombinedReducers = persistReducer(persistConfig, combinedReducers);

export const store = createStore(persistedCombinedReducers);
// export const store = configureStore({ reducer: persistedCombinedReducers });

export const persistedStore = persistStore(store);