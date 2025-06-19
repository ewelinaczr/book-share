import axiosInstance from "./axiosInstance";

export type LoginPayload = {
  email: string;
  password: string;
};

export async function loginUser(data: LoginPayload): Promise<any> {
  const res = await axiosInstance.post("/users/login", data);
  return res.data;
}
