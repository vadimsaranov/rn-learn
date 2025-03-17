import { CityListItem } from '@components/CityListItem';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { CitiesContext } from '@context/CitiesContext';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { Colors } from '@constants/Colors';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { AntDesign } from '@expo/vector-icons';
import { Modal } from '@components/Modal';
import { City } from '@core/City';

export default function WeatherDetailsScreen() {
  const { theme } = useContext(ThemeContext);
  const { deleteCity } = useContext(CitiesContext);
  const styles = themedStyles(theme);

  const [city, setCity] = useState<City | undefined>(undefined);

  const [modalVisible, setModalVisible] = useState(false);

  const searchParams = useLocalSearchParams();
  const cityId = searchParams.cityId as string;

  const { getCityById } = useContext(CitiesContext);

  const onDeletePress = useCallback(() => {
    setModalVisible(true);
  }, []);

  const onConfirmDeletePress = useCallback(() => {
    deleteCity(cityId);
    router.back();
  }, [cityId, deleteCity]);

  const onEditPress = useCallback(() => {
    router.navigate({ pathname: '/addOrEditCityWeather', params: { cityId } });
  }, [cityId]);

  const getCity = async () => {
    const data = await getCityById(cityId);
    setCity(data);
  };

  useEffect(() => {
    getCity();
  }, []);

  if (!city) {
    return <Text i18nKey="common.noDataFound" />;
  }

  return (
    <View style={styles.container}>
      <CityListItem city={city} fullInfo />
      <View style={styles.bottomButtons}>
        <Button i18nKey="common.edit" onPress={onEditPress}>
          <AntDesign size={20} name="edit" />
        </Button>
        <Button onPress={onDeletePress} i18nKey="common.delete">
          <AntDesign size={20} name="delete" color={Colors[theme].red} />
        </Button>
      </View>
      <Modal onClose={() => setModalVisible(false)} visible={modalVisible}>
        <Text style={styles.warningText} i18nKey="home.addOrEditCityWeather.areYousureDelete" />
        <View style={styles.modalButtons}>
          <Button onPress={onConfirmDeletePress} i18nKey="common.yes" />
          <Button onPress={() => setModalVisible(false)} i18nKey="common.no" />
        </View>
      </Modal>
    </View>
  );
}

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    bottomButtons: {
      padding: 16,
      marginTop: 16,
      gap: 16,
    },
    warningText: { fontSize: 20, textAlign: 'center' },
    modalButtons: {
      marginTop: 16,
      flexDirection: 'column',
      gap: 8,
      width: '100%',
    },
  });
