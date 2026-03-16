import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark';

export type PreferencesState = {
  theme: ThemeMode;
  notificationsEnabled: boolean;
};

const initialState: PreferencesState = {
  theme: 'light',
  notificationsEnabled: true,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notificationsEnabled = action.payload;
    },
  },
});

export const { setTheme, toggleTheme, setNotificationsEnabled } = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;
