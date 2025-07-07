import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const CustomLink = ({
  href,
  tooltipText,
  Icon,
  tooltipColor,
  a = false,
  iconColor,
}) => {
  const { t } = useTranslation("layout");
  return (
    <Link
      target={a ? "_blank" : "_self"}
      className={` tooltip tooltip-${
        tooltipColor || "primary"
      } top btn text-2xl btn-circle ${
        iconColor ? iconColor : "text-[var(--secondary-color)]"
      } bg-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center`}
      to={href}
      data-tip={t(tooltipText)}
    >
      <Icon />
    </Link>
  );
};

CustomLink.propTypes = {
  href: PropTypes.string,
  tooltipText: PropTypes.string,
  Icon: PropTypes.elementType,
  tooltipColor: PropTypes.string,
  a: PropTypes.bool,
  iconColor: PropTypes.string,
};
