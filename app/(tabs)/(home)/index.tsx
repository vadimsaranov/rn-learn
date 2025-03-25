import { Button } from '@components/Button';
import { CityListItem } from '@components/CityListItem';
import { FavouriteCities } from '@components/FavouriteCities';
import { Loader } from '@components/Loader';
import { FavoriteCitySheet } from '@components/sheets/FavoriteCitySheet';
import { Text } from '@components/Text';
import { Colors } from '@constants/Colors';
import { CitiesContext } from '@context/CitiesContext';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { City } from '@core/City';
import { AntDesign } from '@expo/vector-icons';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { router } from 'expo-router';
import { useCallback, useContext, useRef, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { cities, loading, loadNextPage, updateCityFavorite, favoriteCities } =
    useContext(CitiesContext);
  const { theme } = useContext(ThemeContext);
  const styles = themedStyles(theme);
  const sheetRef = useRef<TrueSheet>(null);
  const [selectedCity, setSelectedCity] = useState<City | undefined>();
  const [shouldHideFavorites, setShouldHideFavorites] = useState(false);

  const renderItem: ListRenderItem<City> = useCallback(
    ({ item: city }) => (
      <CityListItem city={city} onLongPress={() => openFavoriteCitySheet(city)} />
    ),
    [],
  );

  const listEmptyComponent = useCallback(() => {
    return <Text i18nKey="common.noDataFound" />;
  }, []);

  const openFavoriteCitySheet = async (city: City) => {
    setSelectedCity(city);
    await sheetRef.current?.present();
  };

  const onSheetButtonPress = async (isFavorite: boolean) => {
    if (selectedCity?.id) {
      await updateCityFavorite(selectedCity.id, isFavorite);
    }
  };
  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View>
        <Button
          onPress={() => router.navigate({ pathname: '/addOrEditCityWeather' })}
          i18nKey="home.addNew">
          <AntDesign size={20} name="plus" />
        </Button>
        <Button
          onPress={() => router.navigate({ pathname: '/(tabs)/(home)/charts' })}
          i18nKey="home.charts.charts"
        />
      </View>

      <FavouriteCities
        cities={favoriteCities}
        onLongPress={openFavoriteCitySheet}
        collapsed={shouldHideFavorites}
      />

      <FlatList
        data={cities}
        renderItem={renderItem}
        ListEmptyComponent={listEmptyComponent}
        onEndReached={loadNextPage}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={({ viewableItems }) => {
          if (favoriteCities.length < 3) {
            shouldHideFavorites && setShouldHideFavorites(false);
            return;
          }
          if (viewableItems.length > 0 && viewableItems[0].index && viewableItems[0].index > 1) {
            setShouldHideFavorites(true);
            return;
          }
          setShouldHideFavorites(false);
        }}
      />
      <FavoriteCitySheet
        ref={sheetRef}
        onActionPress={onSheetButtonPress}
        selectedCity={selectedCity}
        limitReached={favoriteCities.length === 3}
      />
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
