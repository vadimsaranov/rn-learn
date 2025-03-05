import { Colors } from '@constants/Colors';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { ReactNode, useContext } from 'react';
import { Modal as ModalRN, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export const Modal = ({ visible, onClose, style, children }: ModalProps) => {
  const { theme } = useContext(ThemeContext);
  const styles = themedStyle(theme);
  return (
    <ModalRN visible={visible} animationType="fade" transparent>
      <Pressable onPress={onClose} style={styles.container} />
      <View style={[styles.content, style]}>{children}</View>
    </ModalRN>
  );
};

const themedStyle = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].grey,
      opacity: 0.5,
    },
    content: {
      position: 'absolute',
      top: '30%',
      width: '70%',
      left: '15%',
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors[theme].background,
      borderRadius: 20,
    },
  });
