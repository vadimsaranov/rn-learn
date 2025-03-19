import { TextInput } from '@components/TextInput';
import { I18nKeyPath, useLocales } from '@hooks/useLocales';
import React from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';

interface ControlledInputProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  placeholder: I18nKeyPath;
  rules?:
    | Omit<
        RegisterOptions<TFieldValues, Path<TFieldValues>>,
        'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
      >
    | undefined;
}

export const ControlledInput = <TfieldValues extends FieldValues>({
  control,
  name,
  errors,
  placeholder,
  rules,
}: ControlledInputProps<TfieldValues>) => {
  const { t } = useLocales();
  return (
    <Controller
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          placeholder={t(placeholder)}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          error={!!errors[name]}
          errorText={errors[name]?.message?.toString()}
        />
      )}
      name={name}
    />
  );
};
