interface IFields {
  label: string;
  type: string;
  readOnly: boolean;
  calculate: string;
}

export interface IModel {
  name: string;
  fields: Record<string, IFields>;
}
