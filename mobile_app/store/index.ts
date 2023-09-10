import { configureStore } from "@reduxjs/toolkit";
import { generalReducer } from "./slice/general";
import { settingsReducer } from "./slice/settings";

export const store = configureStore({
  reducer: {
    general: generalReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
