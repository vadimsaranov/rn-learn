import { CityListItem } from '@/components/CityListItem';
import { useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';

export default function CitiesListScreen() {
  const renderItem: ListRenderItem<string> = useCallback(
    ({ item: cityName }) => <CityListItem cityName={cityName} />,
    [],
  );

  return <FlatList style={styles.container} data={cities} renderItem={renderItem} />;
}

const cities = [
  'San Jose',
  'London',
  'New York',
  'Paris',
  'Hong Kong',
  'Singapore',
  'Beijing',
  'City of Sydney',
  'Sao Paulo',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
