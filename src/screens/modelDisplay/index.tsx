import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { ModelContext } from "../../core/ModelProvider";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Crypto from "expo-crypto";

const DataModelScreen = () => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const { model } = useContext(ModelContext);

  const handleInput = (key: string, value: string) => {
    setInputs({ ...inputs, [key]: value });
  };

  const handleSubmit = () => {
    // perform tasks defined by the data model and display any outputs
    const output = calculateOutput(model?.fields, inputs);
    console.log(output);
    setOutputs(output);
  };

  return (
    <ScrollView>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        {model ? (
          <>
            <Text style={{ fontSize: 20, marginBottom: 30 }}>{model.name}</Text>
            {Object.entries(model.fields)
              .filter((field) => !field[1].readOnly)
              .map(([key, field]) => (
                <View
                  key={key}
                  style={{
                    marginBottom: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    justifyContent: "space-between",
                    width: 300,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{field.label}</Text>
                  <TextInput
                    style={{
                      height: 40,
                      width: 240,
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                    editable={!field.readOnly}
                    keyboardType={
                      field.type === "number" ? "numeric" : "default"
                    }
                    value={inputs[key] ?? ""}
                    onChangeText={(value) => handleInput(key, value)}
                  />
                </View>
              ))}
            {Object.keys(outputs).length !== 0 &&
              Object.keys(outputs).map((output, index) => (
                <View
                  key={index}
                  style={{
                    marginTop: 16,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginBottom: 8,
                    }}
                  >
                    {model.fields[output].label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                    }}
                  >
                    {outputs[output]}
                  </Text>
                </View>
              ))}
          </>
        ) : (
          <Text>Model is Null</Text>
        )}

        <Button title="Submit" onPress={handleSubmit} />
      </SafeAreaView>
    </ScrollView>
  );
};

export default DataModelScreen;

const calculateOutput = (
  fields: Record<string, Record<string, any>> | undefined,
  inputs: { [x: string]: any },
) => {
  const output: Record<string, any> = {};
  if (fields) {
    Object.entries(fields).forEach(async ([key, field]) => {
      if (field.readOnly && field.calculate) {
        const expression = field.calculate.replace(
          /(\w+)/g,
          (match: string | number) => inputs[match] || match,
        );
        console.log(expression);
        output[key] = eval(expression);
        if (key === "hash") {
          const inputString = output[key];
          const result = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            inputString,
          );
          console.log(String(result));
        }
      }
    });
  }
  return output;
};
