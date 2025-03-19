import { CityListItem } from '@components/CityListItem';
import { Text } from '@components/Text';
import { Colors } from '@constants/Colors';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { City } from '@core/City';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { Animated, StyleSheet, useAnimatedValue } from 'react-native';

interface FavouriteCitiesProps {
  cities: City[];
  onLongPress: (city: City) => void;
  collapsed: boolean;
}

export const FavouriteCities = ({ cities, onLongPress, collapsed }: FavouriteCitiesProps) => {
  const { theme } = useContext(ThemeContext);
  const styles = themedStyles(theme);

  const [citiesHeight, setCitiesHeight] = useState(0);
  const heightValue = useAnimatedValue(50);
  const citiesOpacityValue = useAnimatedValue(0);
  const pinnedOpacityValue = useAnimatedValue(0);

  useEffect(() => {
    Animated.timing(heightValue, {
      toValue: collapsed ? 50 : citiesHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Animated.timing(citiesOpacityValue, {
      toValue: collapsed ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Animated.timing(pinnedOpacityValue, {
      toValue: collapsed ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [collapsed, citiesHeight, citiesOpacityValue, pinnedOpacityValue, heightValue]);

  if (cities.length === 0) {
    return null;
  }

  return (
    <Animated.View style={[{ height: heightValue }, styles.container]}>
      {collapsed ? (
        <Animated.View style={[styles.pinned, { opacity: pinnedOpacityValue }]}>
          <Text>Pinned Items</Text>
          <Ionicons name="star" size={18} color={Colors[theme].star} />
        </Animated.View>
      ) : (
        <Animated.View
          style={{ opacity: citiesOpacityValue }}
          onLayout={({ nativeEvent }) => setCitiesHeight(nativeEvent.layout.height)}>
          {cities.map((city) => (
            <CityListItem key={city.id} city={city} onLongPress={() => onLongPress(city)} />
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
};

const themedStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: Colors[theme].background,
      overflow: 'hidden',
    },
    pinned: {
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].buttonBorder,
    },
  });
};
