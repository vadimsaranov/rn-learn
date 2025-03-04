import { CityListItem } from '@components/CityListItem';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useContext } from 'react';
import { CitiesContext } from '@context/CitiesContext';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { Colors } from '@constants/Colors';
import { Text } from '@components/Text';

export default function WeatherDetailsScreen() {
  const { theme } = useContext(ThemeContext);

  const styles = themedStyles(theme);

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

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
  });
