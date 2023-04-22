export interface IFields {
  label: string;
  type: string;
  readOnly: boolean;
  calculate: string | null;
}

export interface IModel {
  name: string;
  fields: Record<string, IFields>;
}
