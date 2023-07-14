import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";
axios.defaults.withCredentials = true;

const getAppxDate = (date) => {
  let time = Math.floor((Date.now() - Date.parse(date)) / (1000 * 60 * 60 * 24));
  if (time === 0) return "today";
  if (time === 1) return "yesterday";
  if (time < 31) return `${time} days ago`;
  time = Math.floor(time / 30);
  if (time < 12) return `${time} months ago`;
  return `${Math.floor(time / 12)} years and ${time % 12} months ago`;
};

const Home = () => {
  const [loading, setloading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setpage] = useState(1);
  const [products, setproducts] = useState([]);
  const [categorylist, setcategoryList] = useState([]);
  const [sortValue, setsortValue] = useState();
  const [price, setPrice] = useState(100000);
  const [age, setAge] = useState(24);
  const [filter, setFilter] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const categories = [
    "Books",
    "Mobiles",
    "Electronics",
    "Accessories",
    "Vehicle",
    "Health & Fitness",
    "Furniture",
    "Calculator",
    "Stationary",
    "Others",
  ];

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

  const getAllProducts = async (page = 1) => {
    try {
      setloading(true);
      const fetchURL = `http://localhost:5000/api/products/getAllProducts?page=${page}&limit=12&sort=${
        sortValue ? sortValue : "-createdAt"
      }`;
      const res = await axios.get(fetchURL);
      if (page !== 1)
        setproducts((prev) => [...prev, ...res.data.data.products]);
      else setproducts(res.data.data.products);
      setHasNextPage(res.data.data.hasNextPage);
      setloading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 2 >
      document.documentElement.scrollHeight
    )
      setpage((prev) => prev + 1);
  };

  const sortProducts = (e) => {
    const x = e.target.value;
    console.log(x);
    if (x !== sortValue) {
      setsortValue(() => x);
    }
  };

  useEffect(() => {
    getUser();
    window.addEventListener("scroll", handleScroll);
  }, []);
  // console.log(user)
  useEffect(() => {
    if (user) getAllProducts();
  }, [user]);

  useEffect(() => {
    if (sortValue !== undefined) {
      getAllProducts();
      setpage(() => 1);
    }
  }, [sortValue]);

  useEffect(() => {
    if (page > 1 && hasNextPage === true) {
      getAllProducts(page);
    }
  }, [page]);

  const handleFilterchange = (e) => {
    // console.log(e.target.value);
    const { value, checked } = e.target;
    if (checked) {
      setcategoryList([...categorylist, value]);
    } else {
      setcategoryList(categorylist.filter((e) => e !== value));
    }
  };
  console.log(categorylist);
  const handleFilter = () => {
    // console.log(e);
    setFilter(false);
  };
  const handleReset = () => {
    setFilter(false);
    setPrice(100000);
    setAge(24)
    setcategoryList([]);
  };
  const showFilters = () => {
    // console.log(filter)
    if (filter) {
      // console.log(filter)
      return (
        <>
          <div className="z-10 p-2 w-96 mt-2 bg-white rounded-lg shadow dark:bg-gray-700 absolute">
            <div id="dropdown" className="p-2 flex justify-between">
              <div>
                <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white font-bold">
                  Category
                </h6>
                <ul
                  className="space-y-2 text-sm"
                  aria-labelledby="dropdownDefault"
                >
                  {categories.map((category, i) => {
                    if (categorylist.includes(category))
                      return (
                        <li className="flex items-center" key={i}>
                          <input
                            type="checkbox"
                            name="category"
                            checked
                            value={category}
                            onChange={(e) => handleFilterchange(e)}
                            // defaultValue=""
                            className="list w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor="apple"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                          >
                            {category}
                          </label>
                        </li>
                      );
                    else
                      return (
                        <li className="flex items-center" key={i}>
                          <input
                            type="checkbox"
                            name="category"
                            value={category}
                            onChange={(e) => handleFilterchange(e)}
                            // defaultValue=""
                            className="list w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor="apple"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                          >
                            {category}
                          </label>
                        </li>
                      );
                  })}
                </ul>
              </div>
              <div className=" w-40">
                <div className="flex justify-between">
                  <label
                    htmlFor="steps-range"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white font-bold"
                  >
                    Price
                  </label>
                  <label
                    htmlFor="steps-range"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    ₹{price}
                  </label>
                </div>
                <input
                  id="steps-range"
                  type="range"
                  min={0}
                  max={100000}
                  onChange={(e) => setPrice(e.target.value)}
                  defaultValue={price}
                  step="50"
                  className="w-40 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between">
                  <label
                    htmlFor="steps-range"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white font-bold"
                  >
                    Age
                  </label>
                  <label
                    htmlFor="steps-range"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {age} months
                  </label>
                </div>
                <input
                  id="steps-range"
                  type="range"
                  min={0}
                  max={240}
                  onChange={(e) => setAge(e.target.value)}
                  defaultValue={age}
                  step="1"
                  className="w-40 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </div>
            <div className=" p-2 bg-white mb-2 flex">
              <button
                type="button"
                onClick={handleReset}
                className="text-black bg-slate-200 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-black-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 hover:text-white hover:bg-slate-500 mt-2 mx-1"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleFilter}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 mt-2 mx-1"
              >
                Show Results
              </button>
            </div>
          </div>
        </>
      );
    } else {
      return;
    }
  };

  const onLoad = () => {
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
  };

  const getAge = (purDate)=>{
    
    const d2 = new Date();
    const d1 = new Date(purDate || Date.now());
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
    
  }
  return (
    <>
      <Navigation user={user} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="flex fixed z-10 top-24">
        <label htmlFor="sort"></label>
        <select
          name="sort"
          id="sort"
          defaultValue="-createdAt"
          className="bg-white rounded-lg shadow dark:bg-gray-900 mx-2"
          onChange={(e) => {
            sortProducts(e);
          }}
        >
          <option value="price">Price ↑</option>
          <option value="-price">Price ↓</option>
          <option value="-createdAt">Recent ↓</option>
          <option value="createdAt">Recent ↑</option>
        </select>
        <div>
          <button
            id="dropdownDefault"
            onClick={() => {
              filter ? setFilter(false) : setFilter(true);
            }}
            data-dropdown-toggle="dropdown"
            className="text-black bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center mx-2 bg-white rounded-lg shadow dark:bg-gray-900"
            type="button"
          >
            Filter
            <svg
              class="w-[18px] h-[18px] text-gray-800 dark:text-white ml-1 pt-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 18"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.2"
                d="m2.133 2.6 5.856 6.9L8 14l4 3 .011-7.5 5.856-6.9a1 1 0 0 0-.804-1.6H2.937a1 1 0 0 0-.804 1.6Z"
              />
            </svg>
          </button>
          {showFilters()}
        </div>
      </div>
      <br />
      <div className="grid md:grid-cols-3 grid-cols-2 gap-y-10 justify-between z-0 ">
        {products?.map((product) => {
          if (
            (categorylist.includes(product.category) ||
            categorylist.length === 0) && (product.price<=price || price == 100000) && (getAge(product.age)<=age || age == 240)
          )
            return (
              <div key={product._id}>
                <Link
                  to="./show-product"
                  state={{
                    data: product,
                    user: user,
                  }}
                >
                  <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 grid grid-cols-3 transition ease-in-out delay-150 hover:-translate-y-1">
                    <img
                      className="rounded-t-lg h-52 w-auto"
                      //  {`../../../backend/images/products/${product.images[0]}`}
                      //  src={require(`../../../backend/images/products/${product.images[0]}`)}
                      crossOrigin="anonymous"
                      // src={"http://localhost:5000/images/products/64940ab0cf981febfb877f12_0.jpg"}
                      src={`http://localhost:5000/images/products/${product.images[0]}`}
                      alt=""
                    />
                    <div className="p-5">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {product.title}
                      </h5>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        ₹ {product.price}
                      </p>
                      {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        {`${getAge(product.age)} months old`}
                      </p> */}
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        {`${getAppxDate(product.createdAt)}`}
                      </p>
                      {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        {`${product.interestedViews} interested`}
                      </p> */}
                    </div>
                  </div>
                </Link>
              </div>
            );
        })}
      </div>
      {onLoad()};
    </>
  );
};

export default Home;
