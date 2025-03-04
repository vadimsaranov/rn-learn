import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

export interface ThemeState {
  currentTheme?: 'light' | 'dark';
}

const initialState: ThemeState = {
  currentTheme: undefined,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<ThemeState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    reset: () => initialState,
  },
});

export const { update: updateTheme, reset: resetThemeSlice } = themeSlice.actions;

export const themeSelector = (state: RootState) => state.theme;

export const themeReducer = themeSlice.reducer;
