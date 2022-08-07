import axios from "axios";

export const getData = (path) => axios.get(process.env.REACT_APP_API_URL + path, { withCredentials: true }).catch(({ response }) => response);
export const postData = (path, data) =>
  axios.post(process.env.REACT_APP_API_URL + path, { data }, { withCredentials: true }).catch(({ response }) => response);
