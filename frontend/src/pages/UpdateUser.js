import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Navigation from "../components/Navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
axios.defaults.withCredentials = true;

const UpdateUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState();
  const [messaged, setMessage] = useState({ messaged: "" });
  const [input, setInput] = useState({
    username: "",
  });

  const getUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/checkLoggedIn"
      );
      if (res.status === 200) {
        setUser(res.data.data.user);
      }
    } catch (e) {
      console.log(e);
      navigate("/info");
      setUser(null);
    }
    setloading(false);
  };
  const getdata = (e) => {
    const { value, name } = e.target;
    setInput(() => {
      return {
        ...input,
        [name]: value,
      };
    });
  };
  const getphotos = (e) => {
    const files = e.target.files;
    setPhoto(files[0]);
    // console.log(files[0])
  };
  const addData = (e) => {
    e.preventDefault();

    const formdata = new FormData();

    formdata.append("userImage", photo);
    formdata.append("removePhoto", removePhoto);

    setMessage({ messaged: "" });

    const { username } = input;
    formdata.append("username", username);
    sendData(formdata);
  };

const sendData=(formdata)=>{
  try {
    axios
      .patch(
        "http://localhost:5000/api/users/updateMe/",
        formdata,
        /*title,
          description,
          price,*/
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          console.log(res)
          toast.success("User Updated Successfully");
          setRemovePhoto(false)
          setTimeout(() => {
            navigate("/user", {
              state: {
                user: res.data.data.user,
              },
            });
          }, 1000);
        }
      });
  } catch (e) {
    console.log(e);
    setMessage({ messaged: e.response.data.message });
  }
}
  const removePhotoFun=(e)=>{
    e.preventDefault();
    setRemovePhoto(true);

    const formdata = new FormData();

    formdata.append("userImage", photo);
    formdata.append("removePhoto", removePhoto);

    setMessage({ messaged: "" });

    const { username } = input;
    formdata.append("username", username);
    sendData(formdata);
  }
  const print = Object.values(messaged);

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return (
      <>
        <h1>
          ...loading <ClipLoader color="#000000" />
        </h1>
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <Navigation user={user} />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-4">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md mt-10">
          {/* <h1 className="font-bold text-center text-2xl mb-5">Your Logo</h1> */}
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="w-full px-4 flex justify-center">
              <div className="relative">
                <img
                  alt="..."
                  crossOrigin="anonymous"
                  src={`http://localhost:5000/images/users/${user.photo}`}
                  //   src="http://localhost:5000/images/users/xyz.png"
                  //   src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg"
                  className="shadow-xl rounded-full h-52 align-middle border-none"
                  //   absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px
                />
              </div>
            </div>
            <div className="px-5 py-7">
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Upload Photo
              </label>
              <input
                type="file"
                name="userImage"
                onChange={getphotos}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              
              <button className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              onClick={removePhotoFun}
              >Remove Photo</button>

              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Username
              </label>
              <input
                type="text"
                name="username"
                defaultValue={user.username}
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />

              <button
                type="button"
                onClick={addData}
                className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Update User</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 inline-block"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
              <label className="font-semibold text-sm text-gray-600 py-4 pb-1 block">
                {print}
              </label>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default UpdateUser;
