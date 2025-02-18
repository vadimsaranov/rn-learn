import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#f1f1f1' } }}>
      <Stack.Screen name="index" options={{ title: 'Weather' }} />
      <Stack.Screen name="details" options={{ title: 'Details' }} />
    </Stack>
  );
}
