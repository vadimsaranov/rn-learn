import { CityListItem } from '@/components/CityListItem';
import { City } from '@/core/City';
import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text } from 'react-native';
import useFetchCities from './hooks/useFetchCity';
import { Loader } from '@/components/Loader';

export default function CitiesListScreen() {
  const { data, loading } = useFetchCities();

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
      data={data}
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
