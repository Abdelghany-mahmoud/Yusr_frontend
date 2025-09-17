import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../../store/tokenAtom/tokenAtom";
import { createPopper } from "@popperjs/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ar";

export default function MessageItem({ message }) {
  const token = useRecoilValue(tokenAtom);
  const me = token?.user?.id;

  dayjs.extend(relativeTime);
  dayjs.locale("ar");

  const isMe = message.sender_id === me;
  const [showMentions, setShowMentions] = useState(false);

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const popperInstance = useRef(null);

  // toggle dropdown
  const toggleDropdown = () => setShowMentions((prev) => !prev);

  // close on click outside
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowMentions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // create popper instance when open
  useEffect(() => {
    if (showMentions && buttonRef.current && dropdownRef.current) {
      popperInstance.current = createPopper(buttonRef.current, dropdownRef.current, {
        placement: "top-start",
        modifiers: [
          { name: "offset", options: { offset: [0, 8] } },
          { name: "preventOverflow", options: { boundary: "viewport" } },
        ],
      });
    }
    return () => {
      if (popperInstance.current) {
        popperInstance.current.destroy();
        popperInstance.current = null;
      }
    };
  }, [showMentions]);

  return (
    <div className={`flex flex-col ${isMe ? "items-start" : "items-end"}`}>
      {/* Optional sender name */}
      {!isMe && (
        <span className="text-xs font-semibold text-gray-500 mb-1">
          {message.sender_name}
        </span>
      )}

      {/* Message bubble */}
      <div
        className={`relative rounded-2xl px-4 py-2 max-w-[70%] break-words shadow-sm ${
          isMe
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
        }`}
      >
        {/* Message text */}
        <p className="leading-relaxed">{message.message}</p>

        {/* Mentions button */}
        {message.mentions?.length > 0 && (
          <div className="mt-1">
            <button
              ref={buttonRef}
              onClick={toggleDropdown}
              className={`text-xs font-medium px-2 py-1 rounded ${
                isMe ? "bg-blue-300 text-gray-800" : "bg-gray-200 text-gray-800"
              }`}
            >
              👥 {message.mentions.length}
            </button>

            {/* Mentions dropdown */}
            {showMentions && (
              <div
                ref={dropdownRef}
                className="z-50 bg-white border rounded-lg shadow-lg p-2 w-max max-w-xs"
              >
                <div className="flex flex-wrap gap-2">
                  {message.mentions.map((m) => (
                    <span
                      key={m.id}
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                    >
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Optional timestamp */}
      {message.created_at && (
        <span className="text-[10px] text-gray-400 mt-0.5">
          {dayjs(message.created_at).fromNow()}
        </span>
      )}
    </div>
  );
}

MessageItem.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sender_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sender_name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    mentions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    created_at: PropTypes.string,
  }).isRequired,
};
