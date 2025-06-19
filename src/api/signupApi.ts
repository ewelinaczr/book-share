import axiosInstance from "./axiosInstance";

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export async function signupUser(data: SignupPayload): Promise<any> {
  const res = await axiosInstance.post("/users/signup", data);
  return res.data;
}
