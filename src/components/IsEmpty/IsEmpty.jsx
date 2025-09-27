import { PropTypes } from "prop-types";

export const IsEmpty = ({ text, height, fontSize }) => {
  return (
    <div
      style={{ minHeight: height || "50vh" }}
      className="flex items-center justify-center"
    >
      <div>
        <h5 className={`${fontSize ? fontSize : "text-3xl"} font-bold text-[var(--primary-color)]`}>
          {text}
        </h5>
      </div>
    </div>
  );
};

IsEmpty.propTypes = {
  text: PropTypes.string,
  height: PropTypes.string,
  fontSize: PropTypes.string,
};
