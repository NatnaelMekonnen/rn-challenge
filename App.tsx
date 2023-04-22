import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { ModelProvider } from "./src/core/ModelProvider";
import { MainNavigator } from "./src/navigation";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();
export default function App() {
  return (
    <ModelProvider> {/*provides the model thats selected to the screens*/}
      <SafeAreaProvider>
        <NavigationContainer>
          <MainNavigator />{/*This contains all the screens with navigation*/}
        </NavigationContainer>
      </SafeAreaProvider>
    </ModelProvider>
  );
}
