import PropTypes from "prop-types";

export const Loading = ({ height, size = "w-20 h-20", border = "border-8" }) => {
  return (
    <div
      style={{ height: height || "65vh" }}
      className="flex items-center justify-center"
    >
      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div
          style={{ borderTopColor: "var(--primary-color)" }}
          className={`${size} ${border} text-4xl animate-spin border-[var(--secondary-text-color)] flex items-center justify-center rounded-full`}
        />
      </div>
    </div>
  );
};

Loading.propTypes = {
  height: PropTypes.string,
  size: PropTypes.string,   // Tailwind size classes e.g. "w-16 h-16"
  border: PropTypes.string, // Tailwind border width e.g. "border-4"
};
