import PropTypes from "prop-types";
import ChatItem from "./ChatItem";

export default function ChatList({ chats, activeChat, setActiveChat }) {
  return (
    <aside className="w-1/4 border-l-2 border-gray-300 bg-white p-4 overflow-y-auto shadow-sm">
      <ul className="space-y-2">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={String(activeChat) === String(chat.id)}
            onClick={() => setActiveChat(chat.id)}
          />
        ))}
      </ul>
    </aside>
  );
}

ChatList.propTypes = {
  chats: PropTypes.arrayOf(ChatItem.propTypes.chat).isRequired,
  activeChat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setActiveChat: PropTypes.func.isRequired,
};