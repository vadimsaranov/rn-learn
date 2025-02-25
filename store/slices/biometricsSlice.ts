import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

export interface BiometricsState {
  enrolled: boolean;
}

const initialState: BiometricsState = {
  enrolled: false,
};

export const biometricsSlice = createSlice({
  name: 'biometrics',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<BiometricsState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    reset: () => initialState,
  },
});

export const { update: updateBiometrics, reset: resetBiometricsSlice } = biometricsSlice.actions;

export const biometricsSelector = (state: RootState) => state.biometrics;

export const biometricsReducer = biometricsSlice.reducer;
