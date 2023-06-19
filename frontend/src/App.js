import './App.css';
import Navigation from './components/Navigation'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home'
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import AskOTP from './pages/AskOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CreateProduct from './pages/CreateProduct';
import LogOut from './pages/LogOut';
import UpdateProduct from './pages/UpdateProduct';

function App() {
  return (
    <> 
        <Router>
        <Navigation/>
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
          </Routes>
        </Router>
    </>
  );
}

export default App;
