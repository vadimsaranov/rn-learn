import { Button } from '@components/Button';
import { CityListItem } from '@components/CityListItem';
import { Loader } from '@components/Loader';
import { CitiesContext } from '@context/CitiesContext';
import { City } from '@core/City';
import { useBiometrics } from '@hooks/useBiometrics';
import { biometricsSelector } from '@store/slices/biometricsSlice';
import { useAppSelector } from '@store/store';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { cities, loading } = useContext(CitiesContext);

  const { promptBiometrics } = useBiometrics();

  const { enrolled: biometricsEnrolled } = useAppSelector(biometricsSelector);

  const renderItem: ListRenderItem<City> = useCallback(
    ({ item: city }) => <CityListItem city={city} />,
    [],
  );

  useEffect(() => {
    if (!biometricsEnrolled) {
      promptBiometrics();
    }
  }, []);

  const listEmptyComponent = useMemo(() => {
    return <Text>No data found</Text>;
  }, []);

  if (!biometricsEnrolled) {
    return (
      <View style={styles.biometrics}>
        <Button title="Unlock screen" onPress={promptBiometrics} />
      </View>
    );
  }
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
  biometrics: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
