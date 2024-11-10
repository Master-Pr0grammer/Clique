import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="forgot_password" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="club_signup" />
        <Stack.Screen name="createpost" />
      </Stack>
    </GestureHandlerRootView>
  );
}

