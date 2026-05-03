export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: Address;
  role: 'customer' | 'admin';
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
