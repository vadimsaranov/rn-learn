import { CityListItem } from '@/components/CityListItem';
import { City } from '@/core/City';
import { useCallback, useContext, useMemo } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text } from 'react-native';
import { Loader } from '@/components/Loader';
import { CitiesContext } from './context/CitiesContext';

export default function CitiesListScreen() {
  const { cities, loading } = useContext(CitiesContext);

  const renderItem: ListRenderItem<City> = useCallback(
    ({ item: city }) => <CityListItem city={city} />,
    [],
  );

  const listEmptyComponent = useMemo(() => {
    return <Text>No data found</Text>;
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <FlatList
      style={styles.container}
      data={cities}
      renderItem={renderItem}
      ListEmptyComponent={listEmptyComponent}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
