import axios from "axios";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";

let user;

const getAppxDate = (date) =>{
  const time = Math.floor((Date.now() - Date.parse(date))/(1000*60*60*24));
  if(time == 0)return "today";
  if(time == 1)return "yesterday";
  if(time < 31)return `${time} days ago`;
  time = Math.floor(time/30);
  if(time <12 )return `${time} months ago`;
  return `${Math.floor(time/12)} years and ${time%12} months ago`;
}

const Home = () => {
  const [loading, setloading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page ,setpage] = useState(1);
  const [products,setproducts] = useState([]);
  const [sortValue,setsortValue] = useState();
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

  const getAllProducts = async (page = 1) => {
    try {
      const fetchURL = `http://localhost:5000/api/products/getAllProducts?page=${page}&limit=12&sort=${sortValue ? sortValue : '-createdAt'}`;
      const res = await axios.get(fetchURL);
      if(page != 1) setproducts((prev)=>[...prev,...res.data.data.products]);
      else setproducts(res.data.data.products);
      setHasNextPage(res.data.data.hasNextPage)
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setTimeout(()=>getUser(), 500);
     getAllProducts();
  },[]);


  const handleScroll = ()=>{
    if((window.innerHeight + document.documentElement.scrollTop + 2) > document.documentElement.scrollHeight)
      setpage((prev)=>prev+1);
  }

  const sortProducts = (e)=>{
    const x = e.target.value;
    console.log(x);
    if(x != sortValue){
      setsortValue(()=>x);      
    }
  }

  useEffect(()=>{
    if(sortValue !== undefined){
      getAllProducts();
    setpage(()=>1);
    }
  },[sortValue]);



  useEffect(()=>{
    window.addEventListener("scroll",handleScroll);
  },[]);

  useEffect(()=>{
    if(page > 1 && hasNextPage === true){
    getAllProducts(page);
    }
  },[page])


  if (loading) {
    return (
      <>
        <h1>
          ...loading <ClipLoader color="#000000" />
        </h1>
      </>
    );
  }

  if(!user){
    return(
      <>
      <Navigation user={user} />
      <h1>Not Logged in</h1>
      </>
    )
  }

  return (
    <>
      <Navigation user={user} />
      <br /><br /><br /><br /><br />
      <div>
          <label htmlFor="sort"></label>
          <select name="sort" id="sort" defaultValue="-createdAt" onChange={(e)=>{sortProducts(e)}}>
            <option value="price">Price ↑</option>
            <option value="-price">Price ↓</option>
            <option value="-createdAt">Recent ↓</option>
            <option value="createdAt">Recent ↑</option>
          </select>
      </div>
      <br />
      <div className="grid md:grid-cols-3 grid-cols-2 gap-y-10 justify-between ">
      
        {products?.map((product) => (
          <Link to="./show-product" 
          state={{
            data: product,
            user: user
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
                  ₹ {product.price}
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {getAppxDate(product.createdAt)}
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
