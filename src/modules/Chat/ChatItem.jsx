import PropTypes from "prop-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ar";

export default function ChatItem({ chat, isActive, onClick }) {
  dayjs.extend(relativeTime);
  dayjs.locale("ar");

  return (
    <li onClick={onClick} className={`flex flex-col gap-3 p-3 rounded-lg overflow-hidden cursor-pointer transition-all ${isActive ? "bg-blue-200 border border-blue-300" : "bg-gray-100 border border-gray-300 hover:bg-gray-300"}`} >
        <div className="flex items-center">
          <img src={chat.avatar} alt={chat.name} className="rounded-full object-cover ml-1 h-9 w-9" />
          <div className="flex items-center flex-wrap font-semibold text-gray-900">
            <span className="ml-1">{chat.name}</span>
            <span className="text-sm text-gray-500">{chat.transaction_code}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-0.5">

          <div className="flex text-sm text-gray-500 truncate">
            <span className="font-medium text-gray-700"> {chat.lastMessage.sender_name}: </span>
            <span className="mr-1">{chat.lastMessage.message}</span>
          </div>

          <div className="text-xs text-gray-500">
            {dayjs(chat.lastMessage.created_at).fromNow()}
          </div>

        </div>
    </li>
  );
}

ChatItem.propTypes = {
  chat: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    transaction_code: PropTypes.string,
    lastMessage: PropTypes.shape({
      sender_name: PropTypes.string,
      message: PropTypes.string,
      created_at: PropTypes.string
    }),
    sender_name: PropTypes.string
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};