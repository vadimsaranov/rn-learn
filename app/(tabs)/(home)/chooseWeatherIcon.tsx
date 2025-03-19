import { Button } from '@components/Button';
import { IconNamesList } from '@context/CitiesContext';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Image, ListRenderItem, Pressable, StyleSheet, View } from 'react-native';

export default function WeatherIcons() {
  const [selectedIcon, setSelectedIcon] = useState<string>('');

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item: icon }) => (
      <Pressable
        style={[styles.imageContainer, selectedIcon === icon && styles.selectedIcon]}
        onPress={() => setSelectedIcon(icon)}>
        <Image
          style={styles.image}
          source={{
            uri: `https://openweathermap.org/img/wn/${icon}@2x.png`,
            cache: 'only-if-cached',
          }}
        />
      </Pressable>
    ),
    [selectedIcon],
  );
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatlist}
        data={IconNamesList}
        renderItem={renderItem}
        numColumns={3}
      />
      <Button
        i18nKey="common.select"
        onPress={() => {
          router.back();
          router.setParams({ selectedIcon });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 32,
    padding: 16,
  },
  flatlist: {
    alignContent: 'center',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
  },
  selectedIcon: {
    borderWidth: 1,
    borderRadius: 8,
  },
});
