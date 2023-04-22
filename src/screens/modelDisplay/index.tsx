import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { ModelContext } from "../../core/ModelProvider";

const DataModelScreen = () => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const { model } = useContext(ModelContext);

  const handleInput = (key: string, value: string) => {
    setInputs({ ...inputs, [key]: value });
  };

  const handleSubmit = () => {
    // perform tasks defined by the data model and display any outputs
    const output = calculateOutput(model?.fields, inputs);
    console.log(output);
    Object.keys(output).forEach((val) => {
      inputs[val] = output[val];
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {model ? (
        <>
          <Text style={{ fontSize: 20, marginBottom: 30 }}>{model.name}</Text>
          {Object.entries(model.fields).map(([key, field]) => (
            <View
              key={key}
              style={{
                marginBottom: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
                justifyContent: "space-between",
                width: 220,
              }}
            >
              <Text style={{ fontSize: 16 }}>{field.label}</Text>
              <TextInput
                style={{
                  height: 40,
                  width: 180,
                  borderColor: "gray",
                  borderWidth: 1,
                  borderRadius: 5,
                }}
                editable={!field.readOnly}
                keyboardType={field.type === "int" ? "numeric" : "default"}
                value={inputs[key] ?? ""}
                onChangeText={(value) => handleInput(key, value)}
              />
            </View>
          ))}
        </>
      ) : (
        <Text>Model is Null</Text>
      )}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default DataModelScreen;

const calculateOutput = (
  fields: Record<string, Record<string, any>> | undefined,
  inputs: { [x: string]: any },
) => {
  const output: Record<string, any> = {};
  if (fields) {
    Object.entries(fields).forEach(([key, field]) => {
      if (field.readOnly && field.calculate) {
        const expression = field.calculate.replace(
          /(\w+)/g,
          (match: string | number) => inputs[match] ?? "0",
        );
        output[key] = eval(expression);
      }
    });
  }
  return output;
};
