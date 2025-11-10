export interface IUser {
  _id: string;
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
  googleId?: string;
}
