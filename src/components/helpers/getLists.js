import Axios from 'axios';


export default function getLists(username, setCategoryList, setPaymentList) {
    const user = {username: username};
    Axios.post("http://localhost:5000/users/getCategory", user, {
      withCredentials: true,
    })
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          setCategoryList(response.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
    Axios.post("http://localhost:5000/users/getPayment", user, {
      withCredentials: true,
    })
      .then((response) => {
        if (response.data !== "") {
          console.log(response.data)
          setPaymentList(response.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
  }