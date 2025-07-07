import { NavLink } from "react-router-dom";
import { PropTypes } from "prop-types";
import "./NavLinkAside.css";

export const NavLinkAside = ({ Icon, open, linkName, linkTo }) => {
  return (
    <NavLink
      className={`${
        open ? "large-link" : "small-link"
      } flex items-center justify-between aside_nav_link`}
      data-link-name={linkName}
      to={linkTo}
    >
      <span className="flex">
        <Icon size={"25px"} className="flex" />
      </span>
      <span className={`${open ? "block" : "hidden opacity-0"} text-xs flex`}>
        {linkName}
      </span>
    </NavLink>
  );
};

NavLinkAside.propTypes = {
  Icon: PropTypes.elementType,
  open: PropTypes.bool,
  linkName: PropTypes.string,
  linkTo: PropTypes.string,
};
