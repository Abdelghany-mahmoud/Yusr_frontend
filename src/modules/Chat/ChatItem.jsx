import PropTypes from "prop-types";

export default function ChatItem({ chat, isActive, onClick }) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${isActive ? "bg-blue-100 border border-blue-300" : "hover:bg-gray-100"}`}
    >
      <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
      <div className="flex-1">
        <p className="font-semibold text-gray-900">
          {chat.name} <span className="text-sm text-gray-500">{chat.transaction_code}</span>
        </p>
        <p
          className="text-sm text-gray-500 truncate mt-0.5 w-64"
          dir="auto" // 👈 auto-detects RTL/LTR based on content
        >
          {chat.lastMessage?.sender_name && (
            <span className="font-medium text-gray-700">
              {chat.lastMessage.sender_name}
            </span>
          )}
          {chat.lastMessage?.message && `: ${chat.lastMessage.message}`}
        </p>
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
    }),
    sender_name: PropTypes.string
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};