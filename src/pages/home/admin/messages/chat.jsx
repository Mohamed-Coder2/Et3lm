import React from "react";

import dots from '../../../../assets/3dots.svg'
import pencil from '../../../../assets/pencil.svg'
import send from '../../../../assets/send.svg'

const Chat = ({ User }) => {
  // Default message if no user is selected
  const defaultMessage = "Please select a user";
  const [message, setMessage] = React.useState("");

  return (
    <div className="text-blk m-4 mt-6 shadow-blue-300 shadow-md w-1/2 p-4 rounded-lg">
      {/* Check if User is null or undefined */}
      {User ? (
      <>
        <div className="border-b border-gray-400 flex items-center justify-between w-full">
          <div className="flex items-center p-2">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <img src={User.Pfp} alt="Profile" className="w-full h-full object-cover object-center" />
            </div>
            <h1 className="text-2xl">{User.Name}</h1>
          </div>
          <div className="p-2 hover:cursor-pointer">
            <img src={dots}></img>
          </div>
        </div>

        <div className="overflow-auto h-3/4">
          <p className="bg-gray-300 w-fit p-2 rounded-md m-4">{User.Text}</p>
          <p className="bg-gray-300 w-fit p-2 rounded-md m-4">{User.Text}</p>
          <p className="bg-gray-300 w-fit p-2 rounded-md m-4">{User.Text}</p>
          <p className="bg-gray-300 w-fit p-2 rounded-md m-4">{User.Text}</p>
          <p className="bg-gray-300 w-fit p-2 rounded-md m-4">{User.Text}</p>
          <p className="bg-gray-300 w-fit p-2 rounded-md m-4">{User.Text}</p>
          <p className="bg-gray-300 w-fit p-2 rounded-md m-4">{User.Text}</p>
          <p className="bg-gray-300 w-fit p-2 rounded-md m-4">{User.Text}</p>
          <p className="bg-gray-300 w-fit p-2 rounded-md m-4">{User.Text}</p>
          <p className="bg-gray-300 w-fit p-2 rounded-md m-4">{User.Text}</p>
          <p className="bg-gray-300 w-fit p-2 rounded-md m-4">{User.Text}</p>
          <p className="bg-gray-300 w-fit p-2 rounded-md m-4">{User.Text}</p>
          <p className="bg-gray-300 w-fit p-2 rounded-md m-4">{User.Text}</p>
          <p className="bg-gray-300 w-fit p-2 rounded-md m-4">{User.Text}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center w-3/4 p-2 ml-4">
            <img src={pencil} className="mr-4 ml-4" />
            <input
              type="text"
              className="p-2 w-full text-base font-semibold outline-0"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="pr-8 pl-8 bg-main rounded-xl h-14 flex items-center justify-center">
            <img src={send}/>
          </div>
        </div>
      </>

      ) : (
        <h1>{defaultMessage}</h1>
      )}
    </div>
  );
};

export default Chat;