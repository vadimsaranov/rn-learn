import { Button } from '@components/Button';
import { Text } from '@components/Text';
import { Colors } from '@constants/Colors';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { City } from '@core/City';
import { AntDesign } from '@expo/vector-icons';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface FavoriteCitySheetProps {
  onActionPress: (isFavorite: boolean) => Promise<void>;
  selectedCity?: City;
  limitReached: boolean;
}

export const FavoriteCitySheet = forwardRef<TrueSheet, FavoriteCitySheetProps>(
  ({ onActionPress, selectedCity, limitReached }, ref) => {
    const { theme } = useContext(ThemeContext);
    const styles = themedStyles(theme);

    const sheetRef = useRef<TrueSheet>(null);

    useImperativeHandle(ref, () => sheetRef.current!);

    const onButtonPress = async (isFavorite: boolean) => {
      await onActionPress(isFavorite);
      await dismiss();
    };

    const dismiss = async () => {
      await sheetRef.current?.dismiss();
    };

    return (
      <TrueSheet ref={sheetRef} sizes={['small']} cornerRadius={24}>
        <GestureHandlerRootView style={styles.sheetContent}>
          <Text style={styles.sheetTitle} i18nKey="home.favoritesSheet.addCityToFavorites" />
          <View style={styles.sheetButtons}>
            <Button
              i18nKey="home.favoritesSheet.addToFavorites"
              onPress={() => onButtonPress(true)}
              disabled={limitReached || !!selectedCity?.isFavorite}>
              <AntDesign size={20} name="star" color={Colors[theme].star} />
            </Button>
            <Button
              i18nKey="home.favoritesSheet.removeFromFavorites"
              onPress={() => onButtonPress(false)}
              disabled={!selectedCity?.isFavorite}>
              <AntDesign size={20} name="close" color={Colors[theme].red} />
            </Button>
          </View>
        </GestureHandlerRootView>
      </TrueSheet>
    );
  },
);

FavoriteCitySheet.displayName = 'FavoriteCitySheet';

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    sheetContent: {
      justifyContent: 'center',
      paddingTop: 32,
      paddingHorizontal: 16,
      gap: 12,
    },
    sheetTitle: {
      textAlign: 'center',
      fontSize: 24,
    },
    sheetButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  });
