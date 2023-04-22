import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { ModelContext } from "../../core/ModelProvider";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Crypto from "expo-crypto";
import { IFields } from "../../types";

const DataModelScreen = () => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const { model } = useContext(ModelContext);

  /**
   * This function updates the state of inputs by setting a new value for a specific key.
   * @param {string} key - a string representing the key of the input field being updated
   * @param {string} value - The value parameter is a string representing the new value that will be
   * assigned to the specified key in the inputs object.
   */
  const handleInput = (key: string, value: string) => {
    setInputs({ ...inputs, [key]: value });
  };

  /**
   * This function handles the submission of inputs and calculates the output using a model's fields.
   */
  const handleSubmit = async () => {
    const output = await calculateOutput(model?.fields, inputs);
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
            {/* maps through the fields of the model and renders the ones that are not readonly*/}
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
            {/* maps through the outputs of the calculation*/}
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

/**
 * calculates output based on input fields and their properties.
 * @param {Record<string, IFields> | undefined} fields - an object containing information about the
 * field, such as its type, label, and validation rules.
 * @param inputs - An object containing input values for the calculation. 
 * @returns an object containing the calculated output values
 */
const calculateOutput = async (
  fields: Record<string, IFields> | undefined,
  inputs: { [x: string]: any },
) => {
  const output: Record<string, any> = {};
  if (fields) {
    for (const [key, field] of Object.entries(fields)) {
      if (field.readOnly && field.calculate) {
        const expression = field.calculate.replace(
          /(\w+)/g,
          (match: string | number) => inputs[match] || match,
        );
        if (key === "hash") {
          const salt = eval(expression);
          const hash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            salt,
          );
          output[key] = String(hash);
        } else {
          output[key] = eval(expression);
        }
      }
    }
  }
  return output;
};
