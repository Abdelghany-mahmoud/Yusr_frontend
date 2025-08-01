import PropTypes from "prop-types";
import { Spinner } from "../Spinner/Spinner";
import { memo } from "react";

export const Button = memo(
  ({
    text = "Click Me",
    style = {},
    className = "",
    type = "button",
    loading = false,
    disabled = false,
    onClick,
  }) => {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{ ...style }}
        type={type}
        className={
          `hover:scale-[1.02] transition-all duration-300 rounded-md py-3 shadow-sm hover:shadow-lg ` +
          " " +
          className
        }
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div>{text}</div>
            <div>
              <Spinner />
            </div>
          </div>
        ) : (
          <div>{text}</div>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

Button.propTypes = {
  text: PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  style: PropTypes.object,
  className: PropTypes.string,
  type: PropTypes.string,
  Spinner: PropTypes.node,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};
