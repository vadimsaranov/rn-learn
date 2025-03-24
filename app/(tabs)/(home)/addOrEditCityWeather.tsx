import { Button } from '@components/Button';
import { ControlledInput } from '@components/ControlledInput';
import { Header } from '@components/Header';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { CitiesContext } from '@context/CitiesContext';
import { City, Weather } from '@core/City';
import { zodResolver } from '@hookform/resolvers/zod';
import { I18nKeyPath } from '@hooks/useLocales';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { z, ZodType } from 'zod';

interface FormData {
  cityName: string;
  weatherType: string;
  temperature: string;
  humidity: string;
  pressure: string;
  windSpeed?: string;
  cloudCover?: string;
}

const WeatherSchema: ZodType<FormData> = z.object({
  cityName: z.string().nonempty({ message: 'City name is required' }),
  weatherType: z.string().nonempty({ message: 'Weather type is required' }),
  temperature: z
    .string()
    .nonempty({ message: 'Temperature  is required' })
    .refine((value) => !isNaN(parseInt(value)), {
      message: 'Temperature must be a number',
    }),
  humidity: z
    .string()
    .nonempty({ message: 'Humidity  is required' })
    .refine((value) => !isNaN(parseInt(value)), {
      message: 'Humidity must be a number',
    }),
  pressure: z
    .string()
    .nonempty({ message: 'Pressure  is required' })
    .refine((value) => !isNaN(parseInt(value)), {
      message: 'Pressure must be a number',
    }),
  windSpeed: z
    .string()
    .optional()
    .refine((value) => !value || !isNaN(parseInt(value)), {
      message: 'Wind speed must be a number',
    }),
  cloudCover: z
    .string()
    .optional()
    .refine((value) => !value || !isNaN(parseInt(value)), {
      message: 'Cloud cover must be a number',
    }),
});

type InputName<T extends string> = T | Omit<string, T>;
interface Input {
  inputName: InputName<keyof FormData>;
  placolder: I18nKeyPath;
}

const inputsList: Input[] = [
  { inputName: 'cityName', placolder: 'home.cityName' },
  { inputName: 'weatherType', placolder: 'home.weatherType' },
  { inputName: 'icon', placolder: 'home.chooseImage' },
  { inputName: 'temperature', placolder: 'home.temperature' },
  { inputName: 'humidity', placolder: 'home.humidity' },
  { inputName: 'pressure', placolder: 'home.pressure' },
  { inputName: 'windSpeed', placolder: 'home.windSpeed' },
  { inputName: 'cloudCover', placolder: 'home.cloudCover' },
];

export default function AddOrEditCityWeather() {
  const searchParams = useLocalSearchParams();

  const cityId = searchParams.cityId as string;
  const paramsIcon = searchParams.selectedIcon as string;

  const { getCityById, updateCity } = useContext(CitiesContext);
  const [cityToEdit, setCityToEdit] = useState<City | undefined>(undefined);

  const selectedIcon = paramsIcon || cityToEdit?.icon || '';

  const [modalVisible, setModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(WeatherSchema),
  });

  const onSubmit = (data: FormData) => {
    if (!selectedIcon) {
      return;
    }
    const weather: Weather = {
      description: '',
      icon: '',
      id: cityToEdit?.weather.id || 0,
      main: data.weatherType,
    };
    const city = {
      ...(data.cloudCover && { cloudCover: parseInt(data.cloudCover) }),
      humidity: parseInt(data.humidity),
      icon: searchParams.selectedIcon as string,
      name: data.cityName,
      pressure: parseInt(data.pressure),
      temp: parseInt(data.temperature),
      weather,
      ...(data.windSpeed && { wind: parseInt(data.windSpeed) }),
      id: cityId || uuid.v4(),
    };

    updateCity(city);
    reset();

    router.setParams({ selectedIcon: undefined });
    router.navigate('/(tabs)/(home)');
  };
  const onBackPress = () => {
    const inputValues = getValues();

    if (
      cityToEdit &&
      (inputValues.cityName !== cityToEdit?.name ||
        inputValues.weatherType !== cityToEdit?.weather.main ||
        inputValues.temperature !== cityToEdit?.temp.toString() ||
        inputValues.humidity !== cityToEdit?.humidity.toString() ||
        inputValues.pressure !== cityToEdit?.pressure.toString() ||
        inputValues.windSpeed !== cityToEdit?.wind?.toString() ||
        inputValues.cloudCover !== cityToEdit?.cloudCover?.toString() ||
        selectedIcon !== cityToEdit?.icon)
    ) {
      setModalVisible(true);
    } else {
      router.back();
    }
  };

  const getCity = useCallback(async () => {
    const data = await getCityById(cityId);

    setValue('cityName', data?.name || '');
    setValue('weatherType', data?.weather.main || '');
    setValue('temperature', data?.temp.toString() || '');
    setValue('humidity', data?.humidity.toString() || '');
    setValue('pressure', data?.pressure.toString() || '');
    setValue('windSpeed', data?.wind?.toString());
    setValue('cloudCover', data?.cloudCover?.toString());
    setCityToEdit(data);
  }, [cityId, getCityById, setValue]);

  useEffect(() => {
    if (cityId) {
      getCity();
    }
  }, [cityId, getCity]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPress={onBackPress}
        title={cityId ? 'home.addOrEditCityWeather.editCity' : 'home.addOrEditCityWeather.addCity'}
      />
      {inputsList.map((item, index) =>
        item.inputName === 'icon' ? (
          <View key={index}>
            <Button
              i18nKey="home.chooseImage"
              onPress={() => router.navigate('/chooseWeatherIcon')}
            />

            {!selectedIcon && (
              <Text style={styles.iconLabel} i18nKey="home.addOrEditCityWeather.pleaseSelectIcon" />
            )}

            {!!selectedIcon && (
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${selectedIcon}@2x.png`,
                }}
                style={styles.image}
              />
            )}
          </View>
        ) : (
          <ControlledInput
            key={index}
            errors={errors}
            name={item.inputName as keyof FormData}
            control={control}
            placeholder={item.placolder}
          />
        ),
      )}
      <Button i18nKey="common.submit" onPress={() => handleSubmit(onSubmit)()} />
      <Modal onClose={() => setModalVisible(false)} visible={modalVisible}>
        <Text i18nKey="home.addOrEditCityWeather.leavingWithoutSaving" style={styles.warningText} />

        <View style={styles.modalButtons}>
          <Button onPress={router.back} i18nKey="common.yes" />
          <Button onPress={() => setModalVisible(false)} i18nKey="common.no" />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  textInput: {
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
  },
  image: {
    width: 70,
    height: 70,
    alignSelf: 'center',
  },
  iconLabel: {
    alignSelf: 'center',
  },
  warningText: { fontSize: 20, textAlign: 'center' },
  modalButtons: {
    marginTop: 16,
    flexDirection: 'column',
    gap: 8,
    width: '100%',
  },
});
