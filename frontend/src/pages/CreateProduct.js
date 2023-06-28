import { useState } from "react";
// import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
// import {user} from "./Home"
import Navigation from "../components/Navigation";
import "react-toastify/dist/ReactToastify.css";
// import userToken from "./LogIn";

const CreateProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    title: "",
    description: "",
    price: "",
    category: ""
    // _id: userToken,
  });

  const [messaged, setMessage] = useState({ messaged: "" });
  // const [prodId,setProdId]=useState();

  const getdata = (e) => {
    // console.log(e.target.value);
    const { value, name } = e.target;
    // console.log(value,name)
    setInput(() => {
      return {
        ...input,
        [name]: value,
      };
    });
  };

  const addData = (e) => {
    e.preventDefault();
    setMessage({ messaged: "" });
    const { title, description, price,category } = input;
    // console.log(title, description, price);
    if (title === "") toast.warning("Please enter Title");
    else if (description === "") toast.warning("Please enter Description");
    else if (price === "") toast.warning("Please enter Price");
    else if (price < 0) toast.warning("Please enter valid Price");
    else {
      try {
        axios
          .post("http://localhost:5000/api/products/createProduct", {
            title,
            description,
            price,
            category
          })
          .then((res) => {
            if (res.status === 200) {
              // setProdId({ prodId: res.data.data.product._id });
              // console.log(prodId)
              // console.log(res.data.data.product._id)
              const prod = res.data.data.product;
              // console.log(prodId)
              toast.success("Product Created");
              setTimeout(() => {
                navigate("/update-product", {
                  state: { data: prod, user: location.state.data },
                });
              }, 1000);
            }
          });
      } catch (e) {
        console.log(e);
        setMessage({ messaged: e.response.data.message });
      }
    }
  };
  const print = Object.values(messaged);
  // const print = Object.values(prodId);

  // console.log("hi"+user)
  if (!location.state.data) {
    // console.log("hit")
    return (
      <>
        <h1>
          User not Logged In. Please go to <NavLink to="/login">LogIn</NavLink>{" "}
        </h1>
      </>
    );
  } else {
    return (
      <>
        <Navigation user={location.state.data} />
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-4">
          <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
            <h1 className="font-bold text-center text-2xl mb-5">Your Logo</h1>
            <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
              <div className="px-5 py-7">
                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  onChange={getdata}
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />
                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  onChange={getdata}
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />
                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  onChange={getdata}
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />
                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Category
                </label>
                <select
                  name="category"
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                  onChange={getdata}
                >
                  <option value="Books">Books</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Calculator">Calculator</option>
                  <option value="Stationary">Stationary</option>
                  <option value="Mattress">Mattress</option>
                  <option value="Others">Others</option>
                </select>
                <button
                  type="button"
                  onClick={addData}
                  className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                >
                  <span className="inline-block mr-2">Create Product</span>
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
  }
};
// export {prodId}
export default CreateProduct;
