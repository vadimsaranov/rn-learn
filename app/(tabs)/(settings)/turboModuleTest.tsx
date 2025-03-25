import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import NativeLocalStorage from '../../../specs/NativeLocalStorage';
import { Text } from '@components/Text';
import { useLocales } from '@hooks/useLocales';
import { TextInput } from '@components/TextInput';
import { Button } from '@components/Button';

const EMPTY = '<empty>';

function TurboModuleTest() {
  const [value, setValue] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const { t } = useLocales();

  useEffect(() => {
    const storedValue = NativeLocalStorage?.getItem('myKey');
    setValue(storedValue ?? '');
  }, []);

  function saveValue() {
    NativeLocalStorage?.setItem(editingValue ?? EMPTY, 'myKey');
    setValue(editingValue);
  }

  function clearAll() {
    NativeLocalStorage?.clear();
    setValue('');
  }

  function deleteValue() {
    NativeLocalStorage?.removeItem('myKey');
    setValue('');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text
        i18nKey="settings.turboModules.currentStoredValue"
        i18nOptions={{ value: value || t('common.noDataFound') }}
        style={styles.text}
      />

      <TextInput
        placeholder="settings.turboModules.enterTextYouWantToStore"
        style={styles.textInput}
        onChangeText={setEditingValue}
      />
      <Button i18nKey="common.save" onPress={saveValue} />
      <Button i18nKey="common.delete" onPress={deleteValue} />
      <Button i18nKey="common.clearAll" onPress={clearAll} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    margin: 10,
    fontSize: 20,
  },
  textInput: {
    margin: 10,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
  },
});

export default TurboModuleTest;
