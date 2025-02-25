import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

export interface SessionState {
  loggedIn: boolean;
  token: string;
}

const initialState: SessionState = {
  loggedIn: false,
  token: '',
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<SessionState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    reset: () => initialState,
  },
});

export const { update: updateSession, reset: resetSessionSlice } = sessionSlice.actions;

export const sessionSelector = (state: RootState) => state.session;

export const sessionReducer = sessionSlice.reducer;
