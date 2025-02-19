export interface City {
  name: string;
  weather: Weather;
  temp: number;
  icon: string;
  humidity: number;
  pressure: number;
  wind: number;
  cloudCover: number;
}

interface Weather {
  description: string;
  icon: string;
  id: number;
  main: string;
}
