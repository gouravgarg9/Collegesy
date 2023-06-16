import {Link} from 'react-router-dom';

const Navigation = () => {
  return (
    <>
      <div className="container flex">
         <Link to="/">Home</Link>
         <Link to="/login">Log In</Link>
         <Link to="/signup">Sign Up</Link>
      </div>
    </>
  )
}

export default Navigation
