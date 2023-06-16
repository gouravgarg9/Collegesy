import {useState} from 'react'
// import {NavLink, useNavigate} from 'react-router-dom'
import axios from 'axios'

const ForgotPassword = () => {

    const [input,setInput]=useState({
        email:"",
    })
    const [message,setMessage]=useState({message:""});

    const getdata=(e)=>{
        // console.log(e.target.value);
        const {value,name}=e.target;
        // console.log(value,name)
        setInput(()=>{
          return{
            ...input,
            [name]:value
          }
        })
      }
    
      const addData=async(e)=>{
        e.preventDefault();
        const {email}=input
        if(email==="") alert("Please enter Email")
        else if(!email.includes("@")) alert("Please enter valid Email")
        else{
          try{
            await axios.post('http://localhost:5000/api/users/forgotPassword',{
              email,
            }).then((res)=>{
              setMessage({message: res.message})
            })
          } catch(e){
            console.log(e);
          }
        }
      }
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-4">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <h1 className="font-bold text-center text-2xl mb-5">Your Logo</h1>
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="px-5 py-7">
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <button
                type="button"
                onClick={addData}
                className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Send Mail</span>
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
              {/* <label className="font-semibold text-sm text-gray-600 pb-1 block"> */}
              {/* {message.map(mess => <div>{mess.name}</div>)} */}
              {/* <strong>{message}</strong> */}
              {/* </label> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
