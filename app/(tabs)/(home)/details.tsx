import { CityListItem } from '@components/CityListItem';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useContext } from 'react';
import { CitiesContext } from '@context/CitiesContext';

export default function WeatherDetailsScreen() {
  const searchParams = useLocalSearchParams();
  const cityName = searchParams.cityName as string;

  const { getCityByName } = useContext(CitiesContext);
  const city = getCityByName(cityName);

  if (!city) {
    return <Text>No data found</Text>;
  }

  return (
    <View style={styles.container}>
      <CityListItem city={city} fullInfo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
