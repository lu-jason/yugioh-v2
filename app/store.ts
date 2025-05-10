import cardsSliceReducer from "@/features/cards/cardSlice";
import searchCardReducer from "@/features/cards/searchSlice";
import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
  PersistConfig,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tcgPlayerApi } from "@/features/cards/tcgPlayerApiSlice";

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  cards: searchCardReducer,
  ownedCards: cardsSliceReducer,
  [tcgPlayerApi.reducerPath]: tcgPlayerApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(tcgPlayerApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default {};
