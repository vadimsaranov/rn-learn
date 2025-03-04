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
      const existingCity = state.cities.find((city) => city.id === action.payload.id);

      if (existingCity) {
        const updatedCities = state.cities.map((city) =>
          city.id === action.payload.id ? action.payload : city,
        );
        return { ...state, cities: updatedCities };
      } else {
        const updatedCities = [...state.cities, action.payload];
        return { ...state, cities: updatedCities };
      }
    },
    delete: (state, action: PayloadAction<string>) => {
      const updatedCities = state.cities.filter((city) => city.id !== action.payload);
      return { ...state, cities: updatedCities };
    },
    reset: () => initialState,
  },
});

export const {
  update: updateCities,
  reset: resetCitiesSlice,
  delete: deleteCity,
} = citiesSlice.actions;

export const citiesSelector = (state: RootState) => state.cities;

export const citiesReducer = citiesSlice.reducer;
