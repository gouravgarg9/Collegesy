const getLocalTime = (date,chat,role) => {
    if (!date) return;
    const newDate = new Date(Date.parse(date));
    const day = `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
    const time = `${newDate.getHours()}:${newDate.getMinutes()}`;
    let notify = "";
    if(Date.parse(chat[`lastSeenBy${role}`])< newDate.getTime())notify = "🔔";
    return (
      <span>
        {notify}
        <div>
            <div>{time}</div>
            <div>{day}</div>
        </div>
      </span>
    );
  };

const SingleChatGrid = (props) => {
    let chat = props.chat;
    let role = props.role;
    let message = props.message;

  return (
    <li className="flex justify-between items-center bg-white mt-2 p-2 hover:shadow-lg rounded cursor-pointer transition">
      <div className="flex ml-2">
        {" "}
        <img
          alt=""
          src={`http://localhost:5000/images/users/${chat[`${role}Id`]?.photo || "xyz.png"}`}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex flex-col ml-2">
          {" "}
          <span className="font-medium text-black">
            {chat[`${role}Id`]?.username || "User"}
          </span>{" "}
          <span className="text-sm text-gray-400 truncate w-32">
            {message?.content}
          </span>{" "}
        </div>
      </div>
      <div className="flex flex-col items-center">
        {" "}
        <span className="text-gray-300">
          {getLocalTime(message?.createdAt,chat,(role=="seller")?'Seller':'Buyer')}
        </span>{" "}
        <i className="fa fa-star text-green-400" />{" "}
      </div>
    </li>
  );
};

export default SingleChatGrid;
