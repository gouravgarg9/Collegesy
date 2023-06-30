import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const ChatList = () => {
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const loadChat = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/chats/getChat/" + location.state.data._id
      );
      // setBuying(res.data.data.buyingChats);
      // setSelling(res.data.data.sellingChats);
      console.log(res);
      setChats(res.data.data.chat);
      console.log(chats);
      console.log(res.data.data.chat);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    loadChat();
  }, []);

  return (
    <>
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
              <ul>
                {chats?.map((chat) => (
                  <Link
                    to="/chat"
                    state={{
                      user: location.state.user,
                      chat: chat,
                      data: location.state.data
                    }}
                  >
                    <li
                      className="flex justify-between items-center bg-white mt-2 p-2 hover:shadow-lg rounded cursor-pointer transition"
                      key={chat._id}
                    >
                      <div className="flex ml-2">
                        {" "}
                        <img
                          src="https://i.imgur.com/aq39RMA.jpg"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex flex-col ml-2">
                          {" "}
                          <span className="font-medium text-black">
                            Jessica Koel
                          </span>{" "}
                          <span className="text-sm text-gray-400 truncate w-32">
                            Hey, Joel, I here to help you out please tell me
                          </span>{" "}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        {" "}
                        <span className="text-gray-300">11:26</span>{" "}
                        <i className="fa fa-star text-green-400" />{" "}
                      </div>
                    </li>
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

export default ChatList;
