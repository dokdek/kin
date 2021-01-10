import Axios from "axios";

export default async function getLists(
  username,
  setCategoryList,
  setPaymentList
) {
  const user = { username: username };
  await Axios.post("http://localhost:5000/users/getCategory", user, {
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
  await Axios.post("http://localhost:5000/users/getPayment", user, {
    withCredentials: true,
  })
    .then((response) => {
      if (response.data !== "") {
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
    return 1;
}
