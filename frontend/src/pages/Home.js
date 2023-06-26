import axios from "axios";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";

let user;
let products;

const Home = () => {
  const [loading, setloading] = useState(true);
  const getUser = async () => {
    user = null;
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/checkLoggedIn"
      );
      if (res.status === 200) {
        user = await res.data.data.user;
        // console.log(user)
      }
    } catch (e) {
      console.log(e);
    }
    setloading(false);
  };

  const getAllProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/getAllProducts"
      );
      console.log(res.data.data.products);
      products = res.data.data.products;
      console.log(products[5].images[0]);
      console.log(`http://localhost:5000/images/products/${products[5].images[0]}`);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      getUser();
    }, 500);
    getAllProducts();
  }, []);

  if (loading) {
    return (
      <>
        <h1>
          ...loading <ClipLoader color="#000000" />
        </h1>
      </>
    );
  }

  return (
    <>
      <Navigation user={user} />
      {/* console.log(products) */}
      {/* products.map((product)=> console.log(product)) */}
      <div className="grid md:grid-cols-3 grid-cols-2 gap-y-10 justify-between ">
      
        {products?.map((product) => (
          <Link to="./show-product" 
          state={{
            data: product,
          }}>
            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 grid grid-cols-3">
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
                  {product.description}
                </p>
              </div>
            </div>
            </Link>
        ))}
      </div>
    </>
  );
};

export { user };
export default Home;
