import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

export interface UserState {
  email: string;
  rememberUser: boolean;
}

const initialState: UserState = {
  email: '',
  rememberUser: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<UserState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    reset: () => initialState,
  },
});

export const { update: updateUser } = userSlice.actions;

export const userSelector = (state: RootState) => state.user;

export const userReducer = userSlice.reducer;
