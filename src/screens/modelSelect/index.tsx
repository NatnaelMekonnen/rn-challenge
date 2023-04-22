import React, { useContext, useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { ModelContext } from "../../core/ModelProvider";
import { Picker } from "@react-native-picker/picker";
import { IModel } from "../../types";
import { useNavigation } from "@react-navigation/native";

const ModelSelectionScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const { setModel, availableModels } = useContext(ModelContext);
  const [selectedModel, setSelectedModel] = useState<IModel | null>({
    name: "Select",
    fields: {},
  });

  const handleSelectModel = () => {
    setModel(selectedModel);
    //@ts-ignore
    navigation.navigate("modelDisplay");
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 30 }}>
        Select a Data Model
      </Text>
      <Picker
        selectedValue={selectedModel?.name}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue, index) =>
          setSelectedModel(availableModels[index])
        }
      >
        {availableModels?.map((model, index) => (
          <Picker.Item key={index} label={model.name} value={model} />
        ))}
      </Picker>
      <Button title="Select" onPress={handleSelectModel} />
    </View>
  );
};

export default ModelSelectionScreen;
