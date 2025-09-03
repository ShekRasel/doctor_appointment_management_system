import axios from "axios";

//api base url
export const BASE_URL: string =
  "https://appointment-manager-node.onrender.com/api/v1";

//main api
export const api = axios.create({
  baseURL: BASE_URL,
});

//get token
export const getToken = () => {
  return localStorage.getItem("token");
};

//set token
export const setToken = (tokenString: string) => {
  localStorage.setItem("token", tokenString);
};
