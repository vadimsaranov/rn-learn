import { Button } from '@components/Button';
import { CityChart } from '@components/CityChart';
import { DropDown } from '@components/DropDown';
import { Text } from '@components/Text';
import { Colors } from '@constants/Colors';
import { CitiesContext } from '@context/CitiesContext';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { City } from '@core/City';
import { I18nKeyPath } from '@hooks/useLocales';
import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { barDataItem } from 'react-native-gifted-charts';

type Chart = 'bar' | 'line' | 'area';

type DropDownOption = {
  label: I18nKeyPath;
  value: keyof Pick<City, 'humidity' | 'pressure' | 'wind' | 'temp'>;
};
const dropDownOptions: DropDownOption[] = [
  {
    label: 'home.windSpeed',
    value: 'wind',
  },
  {
    label: 'home.temperature',
    value: 'temp',
  },
  {
    label: 'home.pressure',
    value: 'pressure',
  },
  {
    label: 'home.humidity',
    value: 'humidity',
  },
];

export default function Charts() {
  const { theme } = useContext(ThemeContext);
  const { allCities } = useContext(CitiesContext);
  const styles = themedStyles(theme);

  const [selectedChart, setSelectedChart] = useState<Chart | undefined>();
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [dropDown, setDropDown] = useState<DropDownOption>({
    label: 'home.temperature',
    value: 'temp',
  });

  const onCityPress = (city: City) => {
    const foundCity = selectedCities.find((c) => c.name === city.name);
    if (foundCity) {
      setSelectedCities(selectedCities.filter((c) => c.name !== city.name));
    } else {
      if (selectedCities.length < 5) {
        setSelectedCities([...selectedCities, city]);
      }
    }
  };

  const data: barDataItem[] = selectedCities.map((item) => ({
    value: item[dropDown.value],
    label: item.name,
    labelTextStyle: { color: Colors[theme].text },
  }));

  return (
    <View style={styles.container}>
      <View style={styles.chartButtonsContainer}>
        <Button
          style={[styles.button, selectedChart === 'bar' && styles.selectedButton]}
          i18nKey="home.charts.bar"
          onPress={() => setSelectedChart('bar')}
        />
        <Button
          style={[styles.button, selectedChart === 'line' && styles.selectedButton]}
          i18nKey="home.charts.line"
          onPress={() => setSelectedChart('line')}
        />
        <Button
          style={[styles.button, selectedChart === 'area' && styles.selectedButton]}
          i18nKey="home.charts.area"
          onPress={() => setSelectedChart('area')}
        />
      </View>
      <View style={styles.citiesContainer}>
        {allCities.slice(0, 5).map((city) => (
          <Button
            key={city.id}
            style={selectedCities.includes(city) && styles.selectedButton}
            onPress={() => onCityPress(city)}
            title={city.name}
          />
        ))}
      </View>
      <Text style={styles.dropDownLabel} i18nKey="home.charts.selectFilter" />
      <DropDown i18nKey={dropDown.label} style={styles.dropDown}>
        {dropDownOptions.map((option) => (
          <Button key={option.label} onPress={() => setDropDown(option)} i18nKey={option.label} />
        ))}
      </DropDown>
      <View style={styles.chart}>
        {selectedChart && selectedCities.length > 1 && (
          <CityChart type={selectedChart} data={data} />
        )}
      </View>
    </View>
  );
}

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 16,
    },
    chartButtonsContainer: {
      margin: 16,
      flexDirection: 'row',
      gap: 8,
    },
    citiesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'center',
    },
    button: {
      flex: 1,
    },
    selectedButton: {
      borderColor: Colors[theme].star,
    },
    dropDown: {
      marginHorizontal: 16,
    },
    dropDownLabel: {
      textAlign: 'center',
    },
    chart: {
      marginTop: 16,
    },
  });
