import axios from "axios";

const getData = (path) => {
  axios
    .get(process.env.REACT_APP_API_KEY + path, { withCredentials: true })
    .then((response) => {
      console.log(response.status);
    })
    .catch((error) => {
      console.log(error);
    });
};

// const postData = () => {

// }

export default getData;
// export default postData;
