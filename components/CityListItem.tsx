import { CityAdditionalInfo } from '@components/CityAdditionalInfo';
import { Text } from '@components/Text';
import { Colors } from '@constants/Colors';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { City } from '@core/City';
import { SimpleLineIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useContext } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

interface CityListItemProps {
  city: City;
  fullInfo?: boolean;
}
export const CityListItem = ({ city, fullInfo = false }: CityListItemProps) => {
  const { theme } = useContext(ThemeContext);
  const styles = themedStyles(theme);
  const onCityPress = () => {
    if (!fullInfo) {
      router.navigate({ pathname: '/details', params: { cityName: city.name } });
    }
  };

  return (
    <View>
      <Pressable style={styles.container} onPress={onCityPress}>
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${city.icon}@2x.png`,
            cache: 'only-if-cached',
          }}
          style={styles.image}
        />
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

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].buttonBorder,
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
      color: Colors[theme].text,
    },
    cityWeather: {
      fontSize: 12,
      color: Colors[theme].grey,
    },
    temperatureIndicator: {
      backgroundColor: Colors[theme].tempIndicator,
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 20,
    },
    temperatureText: {
      color: Colors[theme].background,
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
