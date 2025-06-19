import axiosInstance from "./axiosInstance";

export async function logoutUser() {
  const res = await axiosInstance.post("/users/logout");
  return res.data;
}
