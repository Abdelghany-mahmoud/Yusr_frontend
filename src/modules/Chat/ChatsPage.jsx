import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGetData } from "../../hooks/useGetData";
import { useChannel } from "../../hooks/useChannel";
import { useMutate } from "../../hooks/useMatute";
import { useHasPermission } from "../../hooks/useHasPermission";
import { useQueryClient } from "@tanstack/react-query";
import { MessagesSkeleton } from "./MessagesSkeleton";
import ShowCustomer from "../DashboardModules/Customer/Components/ShowCustomer";
import UpdateCustomer from "../DashboardModules/Customer/Components/UpdateCustomer";
import Transactions from "../DashboardModules/Customer/Components/transactions/Transactions";
import CustomerTransaction from "../DashboardModules/Customer/Components/CustomerTransaction";
import ChatList from "./ChatList";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import DocsModal from "./DocsModal";
import { PropTypes } from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../../store/tokenAtom/tokenAtom";
import AddDocs from "../DashboardModules/Customer/Components/ClientDocs/AddDocs";

function ChatsPage({ basePath }) {
  const token = useRecoilValue(tokenAtom);
  const userId = token?.user?.id;
  const { t } = useTranslation("layout");
  const canUpdateClients = useHasPermission("update-clients");
  const canViewTransactions = useHasPermission("read-transactions");
  const canCreateDocuments = useHasPermission("create-documents");
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(chatId || null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  // Keep state in sync with URL param
  useEffect(() => {
    if (chatId !== activeChat) {
      setActiveChat(chatId || null);
    }
  }, [chatId]);

  // Navigate when user selects a chat
  const handleSelectChat = (id) => {
    setActiveChat(id);
    navigate(`${basePath}/chats/${id}`);
  };

  // Fetch chats
  const { data: chatsResponse, isLoading: isChatsLoading } = useGetData({
    endpoint: "chats",
    queryKey: ["chats"],
  });
  const chats = useMemo(() => chatsResponse?.data || [], [chatsResponse]);

  // Fetch employees
  const { data: employeesResponse } = useGetData({
    endpoint: `users?conversationId=${activeChat}`,
    queryKey: ["employees", activeChat],
    enabledKey: basePath === "/dashboard" && !!activeChat,
  });

  const employees = useMemo(() => employeesResponse?.data || [], [employeesResponse]);

  // Fetch messages
  const { data: messagesResponse, isLoading: isMessagesLoading } = useGetData({
    endpoint: activeChat ? `messages/${activeChat}` : null,
    queryKey: ["messages", activeChat],
    enabledKey: !!activeChat,
  });

  const messages = useMemo(() => messagesResponse?.data?.messages || [], [messagesResponse]);
  const customer = useMemo(() => messagesResponse?.data?.customer || {}, [messagesResponse]);

  const currentChat = useMemo(
    () => chats.find((c) => String(c.id) === String(activeChat)),
    [chats, activeChat]
  );

  // Live channel updates
  useChannel(userId ? `private-user.${userId}` : null, {
    "message.sent": (data) => {
      console.log("New message:", data);

      // 1️⃣ Update messages list
      queryClient.setQueryData(["messages", activeChat], (old) => {
        if (!old?.data?.messages) {
          return { data: { messages: [data], customer: old?.data?.customer || {} } };
        }
        return {
          ...old,
          data: {
            ...old.data,
            messages: [...old.data.messages, data],
          },
        };
      });

      // 2️⃣ Update chats list (lastMessage preview)
      queryClient.setQueryData(["chats"], (old) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((chat) =>
            String(chat.id) === String(data.chat_id) // assuming `data.chat_id` is sent with the event
              ? { ...chat, lastMessage: data }
              : chat
          ),
        };
      });
    },
  });

  // Optimistic send
  const sendMessage = useMutate({
    method: "post",
    endpoint: `/send-message/${activeChat}`,
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries(["messages", activeChat]);
      const prevMessages = queryClient.getQueryData(["messages", activeChat]);
      queryClient.setQueryData(["messages", activeChat], (old) => ({
        ...old,
        data: {
          ...old?.data,
          messages: [...(old?.data?.messages || []), { ...newMessage, pending: true }],
        },
      }));
      return { prevMessages };
    },
    onError: (err, newMessage, context) => {
      queryClient.setQueryData(["messages", activeChat], context.prevMessages);
    },
  });

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-50">
      {/* Left: Chat list */}
      <ChatList
        chats={chats}
        activeChat={activeChat}
        setActiveChat={handleSelectChat}
        isLoading={isChatsLoading}
      />

      {/* Right: Conversation */}
      <main className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Header */}
            <div className="border-b p-4 bg-gradient-to-r from-blue-500 to-blue-600 flex justify-between items-center shadow-sm text-white">
              <div className="flex items-center gap-3">
                <img
                  src={currentChat.avatar}
                  alt={currentChat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-semibold">{currentChat.name}</h2>
                  <p className="text-sm opacity-80">{currentChat.transaction_code}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <ShowCustomer customer={customer} />
                {!isMessagesLoading && canUpdateClients && <UpdateCustomer customer={customer} />}
                {!isMessagesLoading && canUpdateClients && <CustomerTransaction customer={customer} />}
                {!isMessagesLoading && canViewTransactions && ( <Transactions id={customer?.user?.id} /> )}
                {!isMessagesLoading && canCreateDocuments && <AddDocs customer={customer} />}
              </div>
            </div>

            {/* Messages */}
            {isMessagesLoading ? <MessagesSkeleton /> : <MessagesList messages={messages} />}

            {/* Input */}
            <MessageInput
              employees={employees} // provide employee list
              currentUserId={userId}
              onSend={(formData) => {
                if (activeChat) {
                  sendMessage.mutate(formData); // your mutate should handle FormData
                }
              }}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            {t("selectChat")}
          </div>
        )}
      </main>

      {/* Docs Modal */}
      {showModal && <DocsModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default ChatsPage;

ChatsPage.propTypes = {
  canViewTransactions: PropTypes.bool,
  canUpdateClients: PropTypes.bool,
  basePath: PropTypes.string,
};