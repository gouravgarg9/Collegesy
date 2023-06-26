import { useLocation } from "react-router-dom";
import { user } from "./Home";
import Navigation from "../components/Navigation";
import { useEffect,useState } from "react";
import Carousel from 'react-elastic-carousel';

const ShowProduct = (props) => {

  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 },
  ];

  // let photo;
  const [photo,setPhoto] = useState();
  useEffect(()=>{
    setPhoto(location.state.data.images[0]);
    // photo=location.state.data.images[0]
    // console.log("hi"+photo)
  },[]);

  const location = useLocation();
  const product = location.state.data
  // console.log(location.state.data.images)
  return (
    <>
      {/* component */}
      <Navigation user={user} />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "@import url(https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css);",
        }}
      />
      <div className="min-w-screen min-h-screen bg-yellow-300 flex items-center p-5 lg:p-10 overflow-hidden relative">
        <div className="w-full max-w-6xl rounded bg-white shadow-xl p-10 lg:p-20 mx-auto text-gray-800 relative md:text-left">
          <div className="md:flex items-center -mx-10">
            <div className="w-full md:w-1/2 px-10 mb-10 md:mb-0">
              <div className="relative">
                <img
                  crossOrigin="anonymous"
                  // src={`http://localhost:5000/images/products/${product.images[0]}`}
                  src={`http://localhost:5000/images/products/${photo}`}
                  className="w-full h-96 border-4 rounded-lg relative z-10"
                  alt="productImage"
                />
                <div className="border-4 border-yellow-200 absolute top-10 bottom-10 left-10 right-10 z-0" />
              </div>
              <div className="flex">
                <Carousel itemsToShow={3}>
                {
                // let arr=location.state.data.images
                location.state.data.images?.map((image) => (
                  <img
                  crossOrigin="anonymous"
                  src={`http://localhost:5000/images/products/${image}`}
                  className="flex-initial w-16 m-2 border-2 cursor-pointer rounded relative z-10"
                  alt="productImage"
                  cursor="pointer"
                  onClick={()=>setPhoto(image)}
                />
               ))}
                </Carousel>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-10">
              <div className="mb-10">
                <h1 className="font-bold uppercase text-2xl mb-5">
                 {product.title}
                </h1>
                <p className="text-sm">
                  {product.description}
                </p>
              </div>
              <div>
                <div className="inline-block align-bottom mr-5">
                  <span className="text-2xl leading-none align-baseline">
                    Rs
                  </span>
                  <span className="font-bold text-5xl leading-none align-baseline">
                    {product.price}
                  </span>
                </div>
                <div className="inline-block align-bottom">
                  <button className="bg-yellow-300 opacity-75 hover:opacity-100 text-yellow-900 hover:text-gray-900 rounded-full px-10 py-2 font-semibold">
                    <i className="mdi mdi-cart -ml-2 mr-2" /> BUY NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* BUY ME A BEER AND HELP SUPPORT OPEN-SOURCE RESOURCES */}
      <div className="flex items-end justify-end fixed bottom-0 right-0 mb-4 mr-4 z-10">
        {/* <div>
          <a
            title="Buy me a beer"
            href="https://www.buymeacoffee.com/scottwindon"
            target="_blank"
            className="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12"
          >
            <img
              className="object-cover object-center w-full h-full rounded-full"
              src="https://i.pinimg.com/originals/60/fd/e8/60fde811b6be57094e0abc69d9c2622a.jpg"
              alt=""
            />
          </a>
        </div> */}
      </div>
    </>
  );
};

export default ShowProduct;
