import * as App from "./GbtbFormApp";

export interface IGbtbFormState {
  status: string;
  fullName: string;
  division: string;
  department: string;
  IDOV: Date;
  msg: any;
}

export const initialSate = {
  status: 'Ready',
  fullName: '',
  division: '',
  department: '',
  IDOV: App.addDays(new Date(), 13),
  msg: '',
};
