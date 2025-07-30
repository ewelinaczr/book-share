export interface User {
  name: string;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm: string;
  rating?: number;
  experience?: number;
  location?: { lat: string; lng: string };
  bookshelf: string[];
  market: string[];
  _id: string;
}
