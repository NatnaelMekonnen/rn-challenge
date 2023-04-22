import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState, useContext } from "react";
import ModelSelectionScreen from "../screens/modelSelect";
import { loadData } from "../utils/loadModels";
import { ModelContext } from "../core/ModelProvider";
import DataModelScreen from "../screens/modelDisplay";

const Stack = createNativeStackNavigator();

export const MainNavigator = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const { setAvailableModels } = useContext(ModelContext);

  const hideSplash = React.useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (modelsLoaded) {
      hideSplash();
    }
  }, [hideSplash, modelsLoaded]);

  useEffect(() => {
    const data = loadData();
    if (data) {
      setModelsLoaded(true);
      setAvailableModels(data);
    }
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
      initialRouteName="modelSelect"
    >
      {/*Screen for selecting which model to load*/}
      <Stack.Screen name="modelSelect" component={ModelSelectionScreen} />{" "}
      {/*Screen which is rendered according to the model*/}
      <Stack.Screen name="modelDisplay" component={DataModelScreen} />{" "}
    </Stack.Navigator>
  );
};
