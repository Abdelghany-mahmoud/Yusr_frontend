import { useTranslation } from "react-i18next";
import { useGetData } from "../../../../../hooks/useGetData";
import { Loading, IsEmpty, Modal, InputField } from "../../../../../components";
import PropTypes from "prop-types";
import { useState } from "react";
import { MdNotes } from "react-icons/md";
import { useMutate } from "../../../../../hooks/useMatute";
import { useSendToWhatsapp } from "../../../../../hooks/useSendToWhatsapp";
import { Form, Formik } from "formik";
import { FiCornerDownRight } from "react-icons/fi";
import { toast } from "react-toastify";

function CustomerNotes({ userId, customer }) {
  const { mutate: sendWhatsapp } = useSendToWhatsapp();
  const [isOpen, setIsOpen] = useState(false);
  const [replyingNoteId, setReplyingNoteId] = useState(null);
  const [activeTab, setActiveTab] = useState("sent");
  const { t } = useTranslation("layout");
  console.log(customer, "customer");
  // Two requests: one for received notes, one for sent notes
  const { data: receivedNotesData, isLoading: isReceivedLoading } = useGetData({
    endpoint: `notes?receiver_id=${userId}&sender_id=${customer.id}`,
    queryKey: ["received-notes", userId, customer.id],
    enabledKey: isOpen && activeTab === "received",
  });

  const { data: sentNotesData, isLoading: isSentLoading } = useGetData({
    endpoint: `notes?receiver_id=${customer.id}&sender_id=${userId}&client_id=${customer.id}`,
    queryKey: ["sent-notes", customer.id, userId],
    enabledKey: isOpen && activeTab === "sent",
  });

  const { mutate: sendNoteReply, isLoading: isSending } = useMutate({
    method: "post",
    endpoint: "notes",
    queryKeysToInvalidate: ["sent-notes", "received-notes"],
  });

  // Use correct notes array based on tab
  const notes =
    activeTab === "received"
      ? receivedNotesData?.data?.data || []
      : sentNotesData?.data?.data || [];
  const isLoading =
    activeTab === "received" ? isReceivedLoading : isSentLoading;

  // Recursive NoteThread component
  const NoteThread = ({ note, level = 0 }) => {
    // Determine if this note is sent by the current user (senderId) or not
    const isMine = note.sender?.id === userId;
    return (
      <div
        className={`flex ${isMine ? "justify-end" : "justify-start"} w-full`}
        style={{ marginTop: level ? 8 : 0 }}
      >
        <div
          className={`relative mb-3  max-w-[80%] min-w-[90%] ${isMine
            ? "bg-blue-100 border-blue-300"
            : "bg-gray-100 border-gray-300"
            } rounded-xl shadow-sm p-3 border`}
          style={{
            marginLeft: !isMine && level ? level * 18 : 0,
            marginRight: isMine && level ? level * 18 : 0,
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span
                className={`font-semibold text-sm ${isMine ? "text-blue-700" : "text-gray-700"
                  }`}
              >
                {note?.sender?.name}
              </span>
              <span className="text-xs text-gray-400">{t("to")}</span>
              <span className="font-semibold text-xs text-gray-500">
                {note?.receiver?.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{new Date(note.created_at).toLocaleString()}</span>
              <button
                className="text-base text-gray-500 hover:text-blue-500"
                onClick={() =>
                  setReplyingNoteId((prev) =>
                    prev === note.id ? null : note.id
                  )
                }
                title={t("reply")}
              >
                <FiCornerDownRight />
              </button>
            </div>
          </div>
          <div
            className={`text-[15px] ${isMine ? "text-blue-900" : "text-gray-900"
              } break-words`}
          >
            {note.note}
          </div>
          {replyingNoteId === note.id && (
            <div className="mt-3 border-t border-gray-200 pt-2">
              <Formik
                initialValues={{ note: "" }}
                onSubmit={(values, { resetForm }) => {
                  sendNoteReply({
                    client_id: customer.id || null,
                    parent_id: note.id,
                    note: values.note,
                    receiver_id: note.sender?.id,
                  }, sendWhatsapp(
                    {
                      user_id: note.sender?.id,
                      message: `${values.note}`,
                      client_id: customer.id || null
                    },
                    {
                      onSuccess: (data) => {
                        toast.success(data?.message);
                      },
                      onError: (error) => {
                        toast.error(error?.response?.data?.message);
                      },
                    }
                  ));
                  resetForm();
                  setReplyingNoteId(null);
                }}
              >
                {() => (
                  <Form className="flex gap-2 items-end mt-2">
                    <InputField
                      name="note"
                      type="text"
                      label={undefined}
                      placeholder={t("write_your_reply")}
                      className="flex-1"
                    />
                    <button
                      type="submit"
                      className="btn btn-xs bg-[var(--primary-color)] text-[var(--secondary-color)] hover:opacity-90"
                      disabled={isSending}
                    >
                      {isSending ? t("sending") + "..." : t("send")}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          )}
          {/* Render replies recursively */}
          {Array.isArray(note.replies) && note.replies.length > 0 && (
            <div className="mt-2 space-y-2">
              {note.replies.map((reply) => (
                <NoteThread key={reply.id} note={reply} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  NoteThread.propTypes = {
    note: PropTypes.object.isRequired,
    level: PropTypes.number,
  }
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={
        <div
          className="tooltip tooltip-info top text-[var(--secondary-text-color)]"
          data-tip={t("notes")}
        >
          <MdNotes />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      title={t("notes")}
      classNameModalStyle={"max-w-[650px] w-full p-3"}
    >
      {/* Tabs for received/sent notes */}
      <div className="flex space-x-4 mb-4 gap-3">
        <button
          onClick={() => setActiveTab("received")}
          className={`px-4 py-2 rounded-lg ${activeTab === "received"
            ? "bg-[var(--primary-color)] text-[var(--secondary-color)]"
            : "bg-[var(--secondary-color)] text-[var(--main-text-color)] border border-[var(--border-color)]"
            }`}
        >
          {t("received_notes")}
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`px-4 py-2 rounded-lg ${activeTab === "sent"
            ? "bg-[var(--primary-color)] text-[var(--secondary-color)]"
            : "bg-[var(--secondary-color)] text-[var(--main-text-color)] border border-[var(--border-color)]"
            }`}
        >
          {t("sent_notes")}
        </button>
      </div>
      <div className="mt-4">
        {isLoading ? (
          <Loading />
        ) : notes.length === 0 ? (
          <IsEmpty text={t("no_notes_found")} />
        ) : (
          <div className="max-h-[60vh] overflow-y-auto space-y-4">
            {notes.map((note) => (
              <NoteThread key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

CustomerNotes.propTypes = {
  userId: PropTypes.number.isRequired,
  customer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    client: PropTypes.object,
  })
};

export default CustomerNotes;
