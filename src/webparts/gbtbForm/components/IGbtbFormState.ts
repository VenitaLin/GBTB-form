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
  IDOV: new Date(),
  msg: '',
};
