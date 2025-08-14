import { PropTypes } from "prop-types";
import { useTranslation } from "react-i18next";

export const IsEmpty = ({ text, height, fontSize }) => {
  const { t } = useTranslation("layout");
  return (
    <div
      style={{ minHeight: height || "50vh" }}
      className="flex items-center justify-center"
    >
      <div>
        <h5 className={`${fontSize ? fontSize : "text-3xl"} font-bold text-[var(--primary-color)]`}>
          {t("nothing")} {text} {t("available")}!
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
