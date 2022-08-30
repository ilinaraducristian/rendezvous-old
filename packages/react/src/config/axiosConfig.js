import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

export const getData = (path) =>
  axios
    .get(baseURL + path, {
      withCredentials: true,
    })
    .catch(({ response }) => response);

export const postData = (path, data) =>
  axios
    .post(baseURL + path, data, {
      withCredentials: true,
    })
    .catch(({ response }) => response);

export const deleteData = (path) => {
  axios
    .delete(baseURL + path, {
      withCredentials: true,
    })
    .catch(({ response }) => response);
};

export const acceptFriendshipRequest = (path) => {
  axios
    .patch(
      baseURL + path,
      {
        status: "accepted",
      },
      {
        withCredentials: true,
      }
    )
    .catch(({ response }) => response);
};

export const updateMessageRequest = (path, data) => {
  axios
    .patch(
      baseURL + path,
      {
        text: data,
      },
      {
        withCredentials: true,
      }
    )
    .catch(({ response }) => response);
};
