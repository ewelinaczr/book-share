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
  googleId?: string;
  correctPassword?: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
  _id: string;
}
