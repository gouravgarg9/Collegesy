import axios from "axios";
import { useEffect,useState} from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Navigation from "../components/Navigation";
let user

const Home = () => {

  const [loading, setloading] = useState(true);
  const getUser = async () => {
    user=null
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/checkLoggedIn"
      );
      if (res.status === 200) {
        user = await res.data.data.user
        // console.log(user)
      }
    } catch (e) {
      console.log(e);
    }
    setloading(false)
  };
  useEffect(() => {
    getUser();
  }, []);

  if(loading){
    return(
      <>
      <h1>...loading <ClipLoader color="#000000" /></h1>
      </>
    )
  }

  return (
    <>
        <Navigation user={user}/>
        <h1>this is home page</h1>
    </>
  );
};

export {user}
export default Home;
