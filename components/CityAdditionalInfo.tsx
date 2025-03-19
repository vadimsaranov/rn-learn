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
        <Text i18nKey="home.humidity" />
        <Text style={styles.greyText} i18nKey="home.cityInfo.humidity" i18nOptions={{ humidity }} />
      </View>
      <View style={styles.block}>
        <Text i18nKey="home.pressure" />
        <Text style={styles.greyText} i18nKey="home.cityInfo.pressure" i18nOptions={{ pressure }} />
      </View>
      {!!windSpeed && (
        <View style={styles.block}>
          <Text i18nKey="home.windSpeed" />
          <Text
            style={styles.greyText}
            i18nKey="home.cityInfo.windSpeed"
            i18nOptions={{ windSpeed }}
          />
        </View>
      )}
      {!!cloudCover && (
        <View style={styles.block}>
          <Text i18nKey="home.cloudCover" />
          <Text
            style={styles.greyText}
            i18nKey="home.cityInfo.cloudCover"
            i18nOptions={{ cloudCover }}
          />
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
