export interface IGbtbFormState {
  status: string;
  fullName: string;
  division: string;
  department: string;
  IDOV: string;
  msg: any;
}

export const initialSate = {
  status: 'Ready',
  fullName: '',
  division: '',
  department: '',
  IDOV: '',
  msg: '',
};
