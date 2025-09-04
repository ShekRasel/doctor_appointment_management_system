import axios from "axios";

//api base url
export const BASE_URL: string =
  "https://appointment-manager-node.onrender.com/api/v1";

//main api
export const api = axios.create({
  baseURL: BASE_URL,
});

//get token

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

//set token
export const setTokenCookie = (token: string) => {
  document.cookie = `token=${token}; path=/; max-age=86400`;
};

//remove token
export const removeTokenCookie = () => {
  document.cookie = "token=; path=/; max-age=0";
};


