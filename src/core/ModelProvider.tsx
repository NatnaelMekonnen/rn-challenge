import React, { createContext, useState } from "react";
import { IModel } from "../types";

interface ModelContextType {
  model: IModel | null;
  setModel: (model: IModel | null) => void;
  availableModels: IModel[] | [];
  setAvailableModels: (model: IModel[] | []) => void;
}

export const ModelContext = createContext<ModelContextType>({
  model: null,
  setModel: () => {},
  availableModels: [],
  setAvailableModels: () => {},
});

export const ModelProvider = ({ children }: { children: any }) => {
  const [model, setModel] = useState<any | undefined>(null);
  const [availableModels, setAvailableModels] = useState<any | undefined>(null);

  return (
    <ModelContext.Provider
      value={{ model, availableModels, setModel, setAvailableModels }}
    >
      {children}
    </ModelContext.Provider>
  );
};
