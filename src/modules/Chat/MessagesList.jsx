import PropTypes from "prop-types";
import MessageItem from "./MessageItem";
import { useRef, useEffect } from "react";

export default function MessagesList({ messages }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
      {messages.length > 0 ? (
        messages.map((msg) => <MessageItem key={msg.id} message={msg} />)
      ) : (
        <div className="flex h-full items-center justify-center text-gray-500 text-lg font-medium">
          لا توجد رسائل بعد — ابدأ المحادثة 👋
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

MessagesList.propTypes = {
  messages: PropTypes.arrayOf(MessageItem.propTypes.message).isRequired,
};
