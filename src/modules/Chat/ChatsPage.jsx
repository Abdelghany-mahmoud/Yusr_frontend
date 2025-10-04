import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGetData } from "../../hooks/useGetData";
import { useChannel } from "../../hooks/useChannel";
import { useMutate } from "../../hooks/useMutate";
import { useHasPermission } from "../../hooks/useHasPermission";
import { useQueryClient } from "@tanstack/react-query";
import { MessagesSkeleton } from "./MessagesSkeleton";
import ShowClient from "../DashboardModules/Client/Components/ShowClient";
import UpdateClient from "../DashboardModules/Client/Components/UpdateClient";
import Transactions from "../DashboardModules/Client/Components/transactions/Transactions";
import ClientTransaction from "../DashboardModules/Client/Components/ClientTransaction";
import ChatList from "./ChatList";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import DocsModal from "./DocsModal";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../../store/tokenAtom/tokenAtom";
import AddDocs from "../DashboardModules/Client/Components/ClientDocs/AddDocs";
import SendFinancingPlan from "../DashboardModules/Client/Components/MainCaseHandler/SendFinancingPlan";
import AddNotes from "../DashboardModules/Client/Components/AddNotes";

function ChatsPage({ basePath }) {
  const token = useRecoilValue(tokenAtom);
  const userId = token?.user?.id;
  const { t } = useTranslation("layout");
  const canUpdateClients = useHasPermission("update-clients");
  const canViewTransactions = useHasPermission("read-transactions");
  const canCreateDocuments = useHasPermission("create-documents");
  const createViewFinancialEvaluation = useHasPermission("create-financial-evaluations");
  const updateViewFinancialEvaluation = useHasPermission("update-financial-evaluations");
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

  const sortedChats = useMemo(() => {
    if (!chats) return [];

    return [...chats].sort((a, b) => {
      // If both have no lastMessage, keep original order
      if (!a.lastMessage && !b.lastMessage) return 0;

      // If only a has no lastMessage, push it down
      if (!a.lastMessage) return 1;

      // If only b has no lastMessage, push it down
      if (!b.lastMessage) return -1;

      // Both have lastMessage: sort by created_at descending
      return new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at);
    });
  }, [chats]);

  // Fetch employees
  const { data: employeesResponse } = useGetData({
    endpoint: `employees-by-chat/${activeChat}`,
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
  const client = useMemo(() => messagesResponse?.data?.client || {}, [messagesResponse]);

  const currentChat = useMemo(
    () => chats.find((c) => String(c.id) === String(activeChat)),
    [chats, activeChat]
  );

  // Live channel updates
  useChannel(userId ? `private-user.${userId}` : null, {
    "message.sent": (data) => {
      // 1️⃣ Update messages list
      queryClient.setQueryData(["messages", activeChat], (old) => {
        if (!old?.data?.messages) {
          return { data: { messages: [data], client: old?.data?.client || {} } };
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
        chats={sortedChats}
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
                <ShowClient client={client} />
                {!isMessagesLoading && (createViewFinancialEvaluation || updateViewFinancialEvaluation) && (<SendFinancingPlan transaction={client.transaction} />)}
                {!isMessagesLoading && canUpdateClients && <UpdateClient client={client} />}
                {!isMessagesLoading && canUpdateClients && <ClientTransaction client={client} />}
                {!isMessagesLoading && canViewTransactions && (<Transactions id={client?.user?.id} />)}
                {!isMessagesLoading && canCreateDocuments && <AddDocs client={client} />}
                <AddNotes client={client} />
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
  basePath: PropTypes.string,
};