import { StyleSheet, Text, View } from 'react-native';

interface CityAdditionalInfoProps {
  humidity: number;
  pressure: number;
  windSpeed: number;
  cloudCover: number;
}
export const CityAdditionalInfo = ({
  humidity,
  pressure,
  windSpeed,
  cloudCover,
}: CityAdditionalInfoProps) => {
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
      <View style={styles.block}>
        <Text>Wind Speed</Text>
        <Text style={styles.greyText}>{windSpeed} mph</Text>
      </View>
      <View style={styles.block}>
        <Text>Cloud Cover</Text>
        <Text style={styles.greyText}>{cloudCover}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginLeft: 12,
    paddingRight: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
  },
  greyText: { color: '#8c8c8c' },
});
