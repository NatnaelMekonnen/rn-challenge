import model1 from "../data/model-one.json";
import model2 from "../data/model-two.json";
import model3 from "../data/model-three.json";

/**
 * The function exports an array of models.
 * @returns An array of models
 */
export const loadData = () => {
  const models = [model1, model2, model3];
  return models;
};
