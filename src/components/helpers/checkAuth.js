import Axios from "axios";
import jwtDecode from "jwt-decode";

const checkAuth = () => {
  return new Promise(function (resolve, reject) {
    Axios.get("https://sheltered-escarpment-85529.herokuapp.com/auth", { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        const user = {
          username: jwtDecode(res.data.token),
          auth: true,
        };
        resolve(user);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          reject(false);
        } else if (error.request) {
          console.log(error.request);
          reject(false);
        } else {
          console.log("Error", error.message);
          reject(false);
        }
      });
  });
};
export default checkAuth;
