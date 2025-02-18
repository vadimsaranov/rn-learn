import { CityListItem } from '@/components/CityListItem';
import { ScrollView, StyleSheet } from 'react-native';

export default function CitiesListScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {cities.map((item, index) => (
        <CityListItem cityName={item} key={index} />
      ))}
    </ScrollView>
  );
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
