import { Button } from '@components/Button';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { I18nKeyPath } from '@hooks/useLocales';
import { ReactNode, useContext, useState } from 'react';
import { Animated, StyleProp, StyleSheet, useAnimatedValue, View, ViewStyle } from 'react-native';

interface DropDownProps {
  title?: string;
  i18nKey?: I18nKeyPath;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const DropDown = ({ title, i18nKey, children, style }: DropDownProps) => {
  const { theme } = useContext(ThemeContext);
  const styles = themedStyles(theme);

  const [isOpen, setIsOpen] = useState(false);
  const [childrenHeight, setChildrenHeight] = useState(0);

  const animatedValue = useAnimatedValue(0);

  const onPress = () => {
    Animated.timing(animatedValue, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <Button onPress={onPress} title={title} i18nKey={i18nKey} style={[styles.dropDown, style]}>
        <Animated.View
          style={{
            height: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 16 + childrenHeight],
            }),
          }}>
          {isOpen && (
            <View
              onLayout={({ nativeEvent }) => setChildrenHeight(nativeEvent.layout.height)}
              style={styles.options}>
              {children}
            </View>
          )}
        </Animated.View>
      </Button>
    </View>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      zIndex: 1,
      height: 24,
    },
    dropDown: {
      borderWidth: 1,
      borderRadius: 16,
      flexDirection: 'column',
      position: 'absolute',
      width: '90%',
    },
    options: {
      alignItems: 'center',
      gap: 12,
    },
  });
