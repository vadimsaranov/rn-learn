import { Text } from '@components/Text';
import { Colors } from '@constants/Colors';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

interface CityAdditionalInfoProps {
  humidity: number;
  pressure: number;
  windSpeed?: number;
  cloudCover?: number;
}
export const CityAdditionalInfo = ({
  humidity,
  pressure,
  windSpeed,
  cloudCover,
}: CityAdditionalInfoProps) => {
  const { theme } = useContext(ThemeContext);
  const styles = themedStyles(theme);

  return (
    <View>
      <View style={styles.block}>
        <Text>Humidity</Text>
        <Text style={styles.greyText}>{humidity}%</Text>
      </View>
      <View style={styles.block}>
        <Text>Pressure</Text>
        <Text style={styles.greyText}>{pressure} hPa </Text>
      </View>
      {!!windSpeed && (
        <View style={styles.block}>
          <Text>Wind Speed</Text>
          <Text style={styles.greyText}>{windSpeed} mph</Text>
        </View>
      )}
      {!!cloudCover && (
        <View style={styles.block}>
          <Text>Cloud Cover</Text>
          <Text style={styles.greyText}>{cloudCover}%</Text>
        </View>
      )}
    </View>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    block: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      marginLeft: 12,
      paddingRight: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].buttonBorder,
    },
    greyText: { color: Colors[theme].grey },
  });
