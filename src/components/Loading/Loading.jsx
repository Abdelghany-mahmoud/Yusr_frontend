import PropTypes from "prop-types";
export const Loading = ({ height }) => {
  return (
    <div
      style={{ height: height || "65vh" }}
      className="flex items-center justify-center"
    >
      <div className="flex-col gap-4 w-full flex items-center justify-center ">
        <div
          style={{ borderTopColor: "var(--primary-color)" }}
          className="w-20 h-20 border-8 text-4xl animate-spin border-[var(--secondary-text-color)] flex items-center justify-center  rounded-full"
        />
      </div>
    </div>
  );
};

Loading.propTypes = {
  height: PropTypes.string,
};
