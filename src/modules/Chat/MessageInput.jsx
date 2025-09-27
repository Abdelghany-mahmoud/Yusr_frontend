import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { usePopper } from "react-popper";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { tokenAtom } from "../../store/tokenAtom/tokenAtom";
import { useRecoilValue } from "recoil";

export default function MessageInput({ onSend, employees, currentUserId }) {
  const { t } = useTranslation("layout");
  const token = useRecoilValue(tokenAtom);
  const userRoles = token?.user?.roles;
  const isClient = userRoles.includes("client");
  const [text, setText] = useState("");
  const [mentions, setMentions] = useState([]);
  const [showEmployeeSelector, setShowEmployeeSelector] = useState(false);
  const [showSelectedDropdown, setShowSelectedDropdown] = useState(false);

  // --- popper elements as state (callback refs) ---
  const [mentionRefEl, setMentionRefEl] = useState(null);
  const [mentionPopperEl, setMentionPopperEl] = useState(null);
  const [selectedRefEl] = useState(null);
  const [selectedPopperEl] = useState(null);

  // --- usePopper for both dropdowns ---
  const {
    styles: mentionStyles,
    attributes: mentionAttrs,
    update: updateMention,
  } = usePopper(mentionRefEl, mentionPopperEl, {
    placement: "top-start", // always on top as requested
    strategy: "fixed", // robust when portaling to body
    modifiers: [
      { name: "offset", options: { offset: [0, 8] } },
      { name: "flip", options: { fallbackPlacements: ["top-start"] } },
      { name: "preventOverflow", options: { boundary: "viewport" } },
    ],
  });

  const {
    update: updateSelected,
  } = usePopper(selectedRefEl, selectedPopperEl, {
    placement: "top-start",
    strategy: "fixed",
    modifiers: [
      { name: "offset", options: { offset: [0, 8] } },
      { name: "flip", options: { fallbackPlacements: ["top-start"] } },
      { name: "preventOverflow", options: { boundary: "viewport" } },
    ],
  });

  // textarea auto-grow
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  // Reposition popper when dropdowns open, on resize and on scroll
  useEffect(() => {
    if (showEmployeeSelector) updateMention?.();
  }, [showEmployeeSelector, mentionRefEl, mentionPopperEl, updateMention]);

  useEffect(() => {
    if (showSelectedDropdown) updateSelected?.();
  }, [showSelectedDropdown, selectedRefEl, selectedPopperEl, updateSelected]);

  useEffect(() => {
    const handler = () => {
      updateMention?.();
      updateSelected?.();
    };
    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler);
    };
  }, [updateMention, updateSelected]);

  // Click outside to close (using the callback-ref elements)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showEmployeeSelector &&
        mentionPopperEl &&
        mentionRefEl &&
        !mentionPopperEl.contains(event.target) &&
        !mentionRefEl.contains(event.target)
      ) {
        setShowEmployeeSelector(false);
      }
      if (
        showSelectedDropdown &&
        selectedPopperEl &&
        selectedRefEl &&
        !selectedPopperEl.contains(event.target) &&
        !selectedRefEl.contains(event.target)
      ) {
        setShowSelectedDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmployeeSelector, showSelectedDropdown, mentionPopperEl, mentionRefEl, selectedPopperEl, selectedRefEl]);

  // mentions management
  const handleSelectEmployee = (emp) => {
    if (!mentions.includes(emp.id)) {
      setMentions((prev) => [...prev, emp.id]);

      // if this was the last available employee → close dropdown
      if (availableEmployees.length === 1) {
        setShowEmployeeSelector(false);
      }
    }
  };

  const removeMention = (id) => setMentions((prev) => prev.filter((m) => m !== id));

  // send logic (Enter to send, Shift+Enter newline)
  const handleSend = () => {
    if (!text.trim() || (!isClient && mentions.length === 0)) return;

    const formData = new FormData();
    formData.append("message", text);

    if (!isClient) {
      mentions.forEach((id) => formData.append("mentions[]", id));
    }

    onSend(formData);

    setText("");
    setMentions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const availableEmployees = employees.filter(
    (emp) => String(emp.id) !== String(currentUserId) && !mentions.includes(emp.id)
  );

  // safety: only portal if document exists (avoids SSR crash)
  const canPortal = typeof document !== "undefined" && document.body;

  return (
    <div className="border-t bg-white p-3 flex flex-col gap-3">

      <div className="flex items-center gap-2">
        {availableEmployees.length > 0 && (
          <button
            ref={setMentionRefEl}
            type="button"
            onClick={() => setShowEmployeeSelector((v) => !v)}
            className="shrink-0 text-sm text-gray-600 px-2 py-1 border rounded hover:bg-gray-100"
            aria-expanded={showEmployeeSelector}
          >
            {t("add_mention")}
          </button>
        )}

        <div className="flex flex-wrap gap-2 flex-grow">
          {mentions.map((id) => {
            const emp = employees.find((e) => String(e.id) === String(id));
            if (!emp) return null;
            return (
              <span
                key={id}
                className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
              >
                {emp.name}
                <button
                  type="button"
                  onClick={() => removeMention(id)}
                  className="ml-1 text-red-500 hover:text-red-600"
                  title={t("remove")}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* --- Message input + Send button --- */}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("type_message")}
          rows={1}
          className="flex-1 resize-none overflow-hidden rounded-lg border border-gray-200 px-3 py-2 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[40px]"
        />
        <button
          onClick={handleSend}
          disabled={
            !text.trim() || (!isClient && mentions.length === 0)
          }
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition shadow ${!text.trim() || (!isClient && mentions.length === 0)
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          title={t("send")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.94 2.94a1 1 0 011.06-.21l13 6.5a1 1 0 010 1.82l-13 6.5A1 1 0 012 16.94V3.06a1 1 0 01.94-.12z" />
          </svg>
          <span className="hidden sm:inline text-sm font-medium">{t("send")}</span>
        </button>
      </div>

      {/* --- portaled dropdown for employee selector --- */}
      {canPortal &&
        createPortal(
          <div
            ref={setMentionPopperEl}
            style={{
              ...mentionStyles.popper,
              visibility: showEmployeeSelector ? "visible" : "hidden",
            }}
            {...mentionAttrs.popper}
            className="bg-white shadow-lg border rounded z-50 w-64 max-h-64 overflow-auto text-sm"
            role="menu"
            aria-hidden={!showEmployeeSelector}
          >
            {availableEmployees.map((emp) => (
              <div
                key={emp.id}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
                onClick={() => handleSelectEmployee(emp)} // stays open now
                role="menuitem"
              >
                {emp.name}
              </div>
            ))}
            {availableEmployees.length === 0 && (
              <div className="px-3 py-2 text-gray-500 italic">{t("all_employees_mentioned")}</div>
            )}
          </div>,
          document.body
        )}
    </div>
  );

}

MessageInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
