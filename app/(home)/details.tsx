import { CityListItem } from '@/components/CityListItem';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function WeatherDetailsScreen() {
  const searchParams = useLocalSearchParams();
  const cityName = searchParams.cityName as string;

  return (
    <View style={styles.container}>
      <CityListItem cityName={cityName} fullInfo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
