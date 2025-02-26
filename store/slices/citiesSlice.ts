import { City } from '@core/City';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

export interface CitiesState {
  cities: City[];
}

const initialState: CitiesState = {
  cities: [],
};

export const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<City>) => {
      const updatedCities = [...state.cities, action.payload];
      return { ...state, cities: updatedCities };
    },
    reset: () => initialState,
  },
});

export const { update: updateCities, reset: resetCitiesSlice } = citiesSlice.actions;

export const citiesSelector = (state: RootState) => state.cities;

export const citiesReducer = citiesSlice.reducer;
