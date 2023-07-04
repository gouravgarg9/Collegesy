import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { socket } from "./../socket";
import Navigation from "../components/Navigation";
import SingleChatGrid from "../components/SingleChatGrid";

axios.defaults.withCredentials=true
const AllChatList = () => {
  const location = useLocation();
  let user = location.state.user;
  const [buyingChats, setBuyingChats] = useState([]);
  const [sellingChats,setSellingChats] = useState([]);
  const [notification, setNotification] = useState([]);

  const loadChat = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chats/getChats");
      setBuyingChats(res.data.data.buyingChats);
      setSellingChats(res.data.data.sellingChats);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadChat();
  }, []);

  const message1Handler = (msg) => {
    if(msg.senderId == user._id) return;
    setNotification((prev) => [msg.chatId, ...prev]);
  }

  useEffect(() => {
    socket.emit("join", user._id);

    socket.on("message1", message1Handler);

    return () => {
      socket.off("message1",message1Handler);
    };
  }, []);

  return (
    <>
      <Navigation user={user} />
      <br /><br /><br />
      <div className="py-10 h-screen bg-gray-300 px-2">
        <div className="max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg overflow-hidden md:max-w-lg">
          <div className="md:flex">
            <div className="w-full p-4">
              <div className="relative">
                {" "}
                <input
                  type="text"
                  className="w-full h-12 rounded focus:outline-none px-3 focus:shadow-md"
                  placeholder="Search..."
                />{" "}
                <i className="fa fa-search absolute right-3 top-4 text-gray-300" />{" "}
              </div>
              <p>Buying...</p>
              <ul>
                {buyingChats?.map((chat) => (
                  <Link key={chat._id} to="/chat" state={{user,chat}}>
                    <SingleChatGrid chat={chat} role="seller" message={chat.latestMessage}/> 
                  </Link>
                ))}
              </ul>
            
              <p>Selling...</p>
              <ul>
                {sellingChats?.map((chat) => (
                  <Link key={chat._id} to="/chat" state={{user,chat}}>
                    <SingleChatGrid chat={chat} role="buyer" message={chat.latestMessage}/>
                  </Link>
                ))}
              </ul>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllChatList;
