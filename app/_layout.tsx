import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FFC4C4",
          height: 70,
          elevation: 0,
        },
        headerTitleStyle: {
          fontWeight: "800",
          fontSize: 20,
          color: "#850E35",
          paddingLeft: 5,
        },
        headerTitleAlign: "left",
        headerTintColor: "#850E35",
      }}
    >
      {/* Halaman pertama: Get Started (index.tsx) */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Login & Register */}
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />

      <Stack.Screen
        name="(tabs)"
        options={{
          title: "Gawé Yogyakarta",
        }}
      />
    </Stack >
  );
}