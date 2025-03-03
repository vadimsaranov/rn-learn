import { Button } from '@components/Button';
import { CityListItem } from '@components/CityListItem';
import { Loader } from '@components/Loader';
import { CitiesContext } from '@context/CitiesContext';
import { City } from '@core/City';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useContext } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text } from 'react-native';

export default function HomeScreen() {
  const { cities, loading, loadNextPage } = useContext(CitiesContext);

  const renderItem: ListRenderItem<City> = useCallback(
    ({ item: city }) => <CityListItem city={city} />,
    [],
  );

  const listEmptyComponent = useCallback(() => {
    return <Text>No data found</Text>;
  }, []);

  const listHeaderComponent = useCallback(() => {
    return (
      <Button onPress={() => router.navigate({ pathname: '/newWeatherCity' })} title={'Add new'}>
        <AntDesign size={20} name="plus" />
      </Button>
    );
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <FlatList
      style={styles.container}
      data={cities}
      renderItem={renderItem}
      ListHeaderComponent={listHeaderComponent}
      ListEmptyComponent={listEmptyComponent}
      onEndReached={loadNextPage}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
