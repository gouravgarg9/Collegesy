import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import AskOTP from "./pages/AskOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreateProduct from "./pages/CreateProduct";
import LogOut from "./pages/LogOut";
import UpdateProduct from "./pages/UpdateProduct";
// import { useEffect, useState} from "react";
// import axios from "axios";
// import Demo from "./pages/Demo";
import ShowProduct from "./pages/ShowProduct";
import UserPage from "./pages/UserPage";

// let user
function App() {
  // const [user, setUser] = useState();
  // const [loading, setloading] = useState(true);

  return (
    <>
      <Router>
          
          <Routes>
            <Route exact path="/" Component={Home}></Route>
            <Route path="/signup" Component={SignUp}></Route>
            <Route path="/login" Component={LogIn}></Route>
            <Route path="/askotp" Component={AskOTP}></Route>
            <Route path="/forgot-password" Component={ForgotPassword}></Route>
            <Route path="/reset-password" Component={ResetPassword}></Route>
            <Route path="/create-product" Component={CreateProduct}></Route>
            <Route path="/update-product" Component={UpdateProduct}></Route>
            <Route path="/logout" Component={LogOut}></Route>
            {/* <Route path="/demo" Component={Demo}></Route> */}
            <Route path="/show-product" Component={ShowProduct}></Route>
            <Route path="/user" Component={UserPage}></Route>
          </Routes>
      </Router>
    </>
  );
}

export default App;
