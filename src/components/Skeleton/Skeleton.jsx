import { PropTypes } from "prop-types";

export const Skeleton = ({ className }) => {
  return <div className={`skeleton ${className}`}/>;
};

Skeleton.propTypes = {
  className: PropTypes.string,
};
