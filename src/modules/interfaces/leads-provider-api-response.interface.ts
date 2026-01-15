export interface ExternalLead {
  gender: 'male' | 'female';
  name: Name;
  location: Location;
  email: string;
  login: Login;
  dob: DateInfo;
  registered: DateInfo;
  phone: string;
  cell: string;
  id: Identification;
  picture: Picture;
  nat: string;
}

export interface Name {
  title: string;
  first: string;
  last: string;
}

export interface Location {
  street: Street;
  city: string;
  state: string;
  country: string;
  postcode: number | string;
  coordinates: Coordinates;
  timezone: Timezone;
}

export interface Street {
  number: number;
  name: string;
}

export interface Coordinates {
  latitude: string;
  longitude: string;
}

export interface Timezone {
  offset: string;
  description: string;
}

export interface Login {
  uuid: string;
  username: string;
  password: string;
  salt: string;
  md5: string;
  sha1: string;
  sha256: string;
}

export interface DateInfo {
  date: string; // ISO string
  age: number;
}

export interface Identification {
  name: string;
  value: string | null;
}

export interface Picture {
  large: string;
  medium: string;
  thumbnail: string;
}
