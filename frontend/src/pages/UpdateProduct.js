import { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
// import {user} from "./Home"
import Navigation from "../components/Navigation";
import "react-toastify/dist/ReactToastify.css";

const UpdateProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // console.log(location);
  const [input, setInput] = useState({
    title: "",
    description: "",
    price: "",
  });

  const [files, setFiles] = useState();
  const [messaged, setMessage] = useState({ messaged: "" });

  const getphotos = (e) => {
    setFiles({
      ...files,
      files: e.target.files,
    });
  };
  // console.log(files);
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

  useEffect(() => {
    setInput({
      title: location.state.prod.title,
      description: location.state.prod.description,
      price: location.state.prod.price,
    });
  }, []);
  const addData = (e) => {
    e.preventDefault();
    // console.log(location)
    const formdata = new FormData();
    // console.log(formdata)
    Array.from(files.files).forEach((item) => {
      // console.log(item)
      formdata.append("productImages", item);
    });

    setMessage({ messaged: "" });
    const { title, description, price } = input;
    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("price", price);
    for (var key of formdata.entries()) {
      console.log(key[0] + ", " + key[1]);
    }
    // const { productImages } = files;
    // console.log(title, description, price);
    // const id=location.state.prodId;
    // if (title === "") alert("Please enter Title");
    // else if (description === "") alert("Please enter Description");
    // else if (price === "") alert("Please enter Price");
    // else {
    // console.log(formdata)
    try {
      axios
        .put(
          "http://localhost:5000/api/products/updateProduct/" +
            location.state.prod._id,
          // productImages: files,
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
            //   setProdId({prodId:res.data.data.product._id})
            // console.log(prodId)
            toast.success("Product Updated Successfully");
            setTimeout(() => {
              navigate("/");
            }, 1000);
          }
        });
    } catch (e) {
      console.log(e);
      setMessage({ messaged: e.response.data.message });
    }
    // }
  };
  const print = Object.values(messaged);

  // {
  //   Array.from(files).map(photo=>{
  //     return{
  //       <span>
  //         <img
  //           src={photo? URL.createObjectURL(photo): null} />
  //       </span>
  //     }
  //   })
  // }

  if (!location.state.user) {
    // console.log("hit")
    return (
      <>
        <h1>
          User not Logged In. Please go to <NavLink to="/login">LogIn</NavLink>{" "}
        </h1>
      </>
    );
  }

  return (
    <>
      <Navigation user={location.state.user} />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-4">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <h1 className="font-bold text-center text-2xl mb-5">Your Logo</h1>
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="px-5 py-7">
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Upload Photos
              </label>
              <input
                type="file"
                multiple
                name="productImages"
                onChange={getphotos}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />

              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={input.title}
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={input.description}
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={input.price}
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <button
                type="button"
                onClick={addData}
                className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Update Product</span>
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

export default UpdateProduct;
