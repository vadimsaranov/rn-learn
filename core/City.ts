export interface City {
  id: string;
  name: string;
  weather: Weather;
  temp: number;
  icon: string;
  humidity: number;
  pressure: number;
  wind?: number;
  cloudCover?: number;
  isFavorite?: boolean;
}

export interface Weather {
  description: string;
  icon: string;
  id: number;
  main: string;
}
