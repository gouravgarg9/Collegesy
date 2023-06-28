// import { user } from "./Home";
import Navigation from "../components/Navigation";
import { useLocation, Link,NavLink } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";
// let products;
const UserPage = () => {

  const location = useLocation();
  const [products,setProduct] = useState([]);
  const [number,setNumber] = useState();
  // console.log(location.state.data)

  const getAllProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products//getAllProductsByUserId"
      );
      console.log(res.data.data.products);
      setNumber(res.data.data.products.length)
      setProduct(res.data.data.products);
      //   console.log(products[5].images[0]);
      console.log(
        `http://localhost:5000/images/products/${products[5].images[0]}`
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  if(!location.state.data){
    // console.log("hit")
    return(
      <>
        <h1>User not Logged In. Please go to <NavLink to="/login">LogIn</NavLink> </h1>
      </>
    )
  }

  return (
    <>
      {/* component */}
      {/* <link
        rel="stylesheet"
        href="https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css"
      />
      <link
        rel="stylesheet"
        href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"
      /> */}
      <Navigation user={location.state.data} />
      <section className="pt-16 bg-blueGray-50">
        <div className="w-full lg:w-4/12 px-4 mx-auto">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4 flex justify-center">
                  <div className="relative">
                    <img
                      alt="..."
                      crossOrigin="anonymous"
                      src={`http://localhost:5000/images/users/${location.state.data.photo}`}
                      //   src="http://localhost:5000/images/users/xyz.png"
                      //   src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg"
                      className="shadow-xl rounded-full h-52 align-middle border-none"
                      //   absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px
                    />
                  </div>
                </div>
                <div className="w-full px-4 text-center mt-10">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {number}
                      </span>
                      <span className="text-sm text-blueGray-400">Products</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-12">
                <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                  {location.state.data.username}
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400" />
                  MNNIT Allahabad, Prayagraj
                </div>
                <div className="mb-2 text-blueGray-600 mt-10">
                  <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400" />
                  Solution Manager - Creative Tim Officer
                </div>
                <div className="mb-2 text-blueGray-600">
                  <i className="fas fa-university mr-2 text-lg text-blueGray-400" />
                  University of Computer Science
                </div>
              </div>
              {/* <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                      An artist of considerable range, Jenna the name taken by
                      Melbourne-raised, Brooklyn-based Nick Murphy writes,
                      performs and records all of his own music, giving it a
                      warm, intimate feel with a solid groove structure. An
                      artist of considerable range.
                    </p>
                    <a
                      href="javascript:void(0);"
                      className="font-normal text-pink-500"
                    >
                      Show more
                    </a>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        {/* <footer className="relative  pt-8 pb-6 mt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center md:justify-between justify-center">
              <div className="w-full md:w-6/12 px-4 mx-auto text-center">
                <div className="text-sm text-blueGray-500 font-semibold py-1">
                  Made with{" "}
                  <a
                    href="https://www.creative-tim.com/product/notus-js"
                    className="text-blueGray-500 hover:text-gray-800"
                    target="_blank"
                  >
                    Notus JS
                  </a>{" "}
                  by{" "}
                  <a
                    href="https://www.creative-tim.com"
                    className="text-blueGray-500 hover:text-blueGray-800"
                    target="_blank"
                  >
                    {" "}
                    Creative Tim
                  </a>
                  .
                </div>
              </div>
            </div>
          </div>
        </footer> */}
        </section>
      <section>
        <div className="grid md:grid-cols-3 grid-cols-2 gap-y-10 justify-between ">
          {products?.map((product) => (
            <Link
              to="./show-product"
              state={{
                data: product,
              }}
            >
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
      </section>
    </>
  );
};

export default UserPage;
