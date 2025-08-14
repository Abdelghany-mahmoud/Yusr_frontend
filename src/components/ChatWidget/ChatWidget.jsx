// components/ChatWidget.jsx
import React, { useState, useEffect } from "react";
import { IoMdChatboxes } from "react-icons/io";
import Pusher from "pusher-js";
import { useRecoilValue } from "recoil";
import styles from "./ChatWidget.module.css";
import { tokenAtom } from "../../store/tokenAtom/tokenAtom";
import { useMutate } from "../../hooks/useMatute";
import { usePusherNotifications } from "../../pusher";

const ChatWidget = ({ receiverId }) => {
  const token = useRecoilValue(tokenAtom);
  const userId = token?.user?.id;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessageMutation = useMutate({
    method: "post",
    endpoint: "send-message",
  });

  // 🔔 Hook into notification system
  usePusherNotifications(userId, (data) => {
    // Optional: Toast or visual alert
    // console.log("🔔 Custom notification callback:", data);
  });

  useEffect(() => {
    if (!userId || !receiverId) return;

    const pusher = new Pusher("555a4f329bcf767eef65", {
      cluster: "eu",
      forceTLS: true,
    });

    const channelName = `messages/sender/${userId}/receiver/${receiverId}`;
    const chatChannel = pusher.subscribe(channelName);
    // setChannel(chatChannel);

    chatChannel.bind(".message.sent", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      chatChannel.unbind_all();
      chatChannel.unsubscribe();
      pusher.disconnect();
    };
  }, [userId, receiverId, token]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      message: newMessage,
      receiver_id: receiverId,
    };

    try {
      await sendMessageMutation.mutateAsync(messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className={styles.chatWidget}>
      <button
        className={styles.chatButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with support"
      >
        <IoMdChatboxes size={24} />
      </button>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>Support Chat</h3>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className={styles.messageList}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.message} ${msg.sender_id === userId ? styles.outgoing : styles.incoming}`}
              >
                <div className={styles.messageContent}>
                  <p className={styles.messageText}>{msg.text}</p>
                  <span className={styles.messageMeta}>
                    {msg.sender_name} ({msg.sender_role})
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.chatInput}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
