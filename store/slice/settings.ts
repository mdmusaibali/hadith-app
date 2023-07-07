import { createSlice } from "@reduxjs/toolkit";

export type Theme = "Dark" | "Light" | "System" | null;
interface stateType {
  theme: Theme;
}
const initialState: stateType = {
  theme: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme(state, { payload: { theme } }: { payload: { theme: Theme } }) {
      state.theme = theme;
    },
    setLocalThemeSettingsToState(state) {},
  },
});

export const settingsActions = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
