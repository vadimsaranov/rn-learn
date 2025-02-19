import { Stack } from 'expo-router';

const ROOT_STACK_OPTIONS = { headerShown: false };

export default function RootLayout() {
  return (
    <Stack screenOptions={ROOT_STACK_OPTIONS}>
      <Stack.Screen name="(home)" />
    </Stack>
  );
}
