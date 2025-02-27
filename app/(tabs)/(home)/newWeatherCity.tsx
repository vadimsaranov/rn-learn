import { Button } from '@components/Button';
import { ControlledInput } from '@components/ControlledInput';
import { Weather } from '@core/City';
import { updateCities } from '@store/slices/citiesSlice';
import { useAppDispatch } from '@store/store';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Image, StyleSheet, Text, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';

const NO_ICON_ERROR_TEXT = 'Please select an icon';

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

const inputsList = [
  { inputName: 'cityName', placolder: 'City name' },
  { inputName: 'weatherType', placolder: 'Weather type' },
  { inputName: 'icon', placolder: 'Choose image' },
  { inputName: 'temperature', placolder: 'Temperature' },
  { inputName: 'humidity', placolder: 'Humidity' },
  { inputName: 'pressure', placolder: 'Pressure' },
  { inputName: 'windSpeed', placolder: 'Wind speed' },
  { inputName: 'cloudCover', placolder: 'City name' },
  { inputName: 'cityName', placolder: 'Cloud cover' },
];

export default function NewWeatherCity() {
  const dispatch = useAppDispatch();
  const searchParams = useLocalSearchParams();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(WeatherSchema),
    defaultValues: {
      cityName: '',
      weatherType: '',
      temperature: '',
      humidity: '',
      pressure: '',
      windSpeed: '',
      cloudCover: '',
    },
  });

  const onSubmit = (data: FormData) => {
    if (searchParams.selectedIcon === undefined) {
      return;
    }
    const weather: Weather = {
      description: '',
      icon: '',
      id: 0,
      main: data.weatherType,
    };

    dispatch(
      updateCities({
        ...(data.cloudCover && { cloudCover: parseInt(data.cloudCover) }),
        humidity: parseInt(data.humidity),
        icon: searchParams.selectedIcon as string,
        name: data.cityName,
        pressure: parseInt(data.pressure),
        temp: parseInt(data.temperature),
        weather,
        ...(data.windSpeed && { wind: parseInt(data.windSpeed) }),
      }),
    );
    reset();
    router.setParams({ selectedIcon: undefined });
    router.back();
  };

  return (
    <View style={styles.container}>
      {inputsList.map((item, index) =>
        item.inputName === 'icon' ? (
          <View key={index}>
            <Button title="Choose image" onPress={() => router.navigate('/chooseWeatherIcon')} />

            {!searchParams.selectedIcon && (
              <Text style={styles.iconLabel}>{NO_ICON_ERROR_TEXT}</Text>
            )}

            {!!searchParams.selectedIcon && (
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${searchParams.selectedIcon}@2x.png`,
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

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
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
});
