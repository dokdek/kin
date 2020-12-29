import Axios from 'axios';
import jwtDecode from 'jwt-decode';



export default function checkAuth(setAuth, setUsername) {
    Axios.get("http://localhost:5000/auth", { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setAuth(res.data.auth);
        setUsername(jwtDecode(res.data.token).username);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          setAuth(false);
        } else if (error.request) {
          console.log(error.request);
          setAuth(false);
        } else {
          console.log("Error", error.message);
          setAuth(false);
        }
      });
  }