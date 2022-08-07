import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;


export const getData = (path) => axios.get(baseURL + path, { withCredentials: true }).catch(({ response }) => response);
export const postData = (path, data) => axios.post(baseURL + path, { data }, { withCredentials: true }).catch(({ response }) => response);
