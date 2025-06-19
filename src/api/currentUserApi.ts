import axiosInstance from "./axiosInstance";

export async function fetchCurrentUser() {
  const res = await axiosInstance.get("/users/me");
  return res.data.data;
}
