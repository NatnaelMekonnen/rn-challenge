import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { ModelProvider } from "./src/core/ModelProvider";
import { MainNavigator } from "./src/navigation";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();
export default function App() {
  return (
    <ModelProvider> 
      <SafeAreaProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </ModelProvider>
  );
}
