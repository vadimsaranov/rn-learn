import { City } from '@/core/City';
import { SimpleLineIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CityAdditionalInfo } from './CityAdditionalInfo';

interface CityListItemProps {
  city: City;
  fullInfo?: boolean;
}
export const CityListItem = ({ city, fullInfo = false }: CityListItemProps) => {
  const onCityPress = () => {
    if (!fullInfo) {
      router.navigate({ pathname: '/(home)/details', params: { cityName: city.name } });
    }
  };

  return (
    <View>
      <Pressable style={styles.container} onPress={onCityPress}>
        <Image src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`} style={styles.image} />
        <View style={styles.flex}>
          <Text style={styles.cityName}>{city?.name}</Text>
          <Text style={styles.cityWeather}>{city?.weather.main}</Text>
        </View>
        <View style={styles.rightBlock}>
          <View style={styles.temperatureIndicator}>
            <Text style={styles.temperatureText}>{city?.temp} °F</Text>
          </View>
          {!fullInfo && <SimpleLineIcons name="arrow-right" size={12} color={'grey'} />}
        </View>
      </Pressable>
      {fullInfo && (
        <CityAdditionalInfo
          cloudCover={city.cloudCover}
          humidity={city.humidity}
          pressure={city.pressure}
          windSpeed={city.wind}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  image: {
    width: 30,
    height: 30,
  },
  cityName: {
    fontSize: 17,
    color: '#3c3c3c',
  },
  cityWeather: {
    fontSize: 12,
    color: '#8c8c8c',
  },
  temperatureIndicator: {
    backgroundColor: '#90e0ef',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  temperatureText: {
    color: 'white',
  },
  rightBlock: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
});
