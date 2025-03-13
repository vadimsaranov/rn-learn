import { CityListItem } from '@components/CityListItem';
import { City } from '@core/City';

interface FavouriteCitiesProps {
  cities: City[];
  onLongPress: (city: City) => void;
}
export const FavouriteCities = ({ cities, onLongPress }: FavouriteCitiesProps) => {
  if (cities.length === 0) {
    return null;
  }
  return cities.map((city) => (
    <CityListItem key={city.id} city={city} onLongPress={() => onLongPress(city)} />
  ));
};
