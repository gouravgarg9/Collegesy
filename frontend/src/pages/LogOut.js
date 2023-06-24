import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "../components/Navigation";
import ClipLoader from "react-spinners/ClipLoader";
axios.defaults.withCredentials = true;

let user = null;

const LogOut = () => {
  const [loading, setloading] = useState(true);
  const navigate = useNavigate();
  const deleteUser = () => {
    try {
      axios
        .post("http://localhost:5000/api/users/logout", {
          Credentials: "include",
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Logged out Successfully");
            setTimeout(() => {
              setloading(false);
              navigate("/");
            }, 500);
          }
        });
    } catch (e) {
      console.log("hit");
      console.log(e);
    }
  };
  useEffect(() => {
    deleteUser();
  }, []);

  if (loading) {
    return (
      <>
        <h1>Thanku for using our website</h1>
        <h1>Logging you out... <ClipLoader color="#000000" /></h1>
      </>
    );
  }
  return (
    <>
      <Navigation user={user} />

      <ToastContainer />
    </>
  );
};

export default LogOut;
