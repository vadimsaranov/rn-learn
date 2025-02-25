import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

export interface AuthState {
  loggedIn: boolean;
  token: string;
}

const initialState: AuthState = {
  loggedIn: false,
  token: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<AuthState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    reset: () => initialState,
  },
});

export const { update: updateAuth, reset: resetAuthSlice } = authSlice.actions;

export const authSelector = (state: RootState) => state.auth;

export const authReducer = authSlice.reducer;
