import PropTypes from "prop-types";
import { memo } from "react";
import { useRecoilValue } from "recoil";
import { languageState } from "../../store/langAtom/languageAtom";

export const PageTitle = memo(({ title, alignSecondLine, fontSize, color }) => {
  const lang = useRecoilValue(languageState);

  return (
    <div
      className={`w-fit relative before:rounded-2xl :before:content-[''] before:w-[100%] before:h-[2px] before:bg-[var(--secondary-dark-color)] before:absolute before:top-10 before:left-0  after:rounded-2xl :before:content-[''] after:w-[65%] after:h-[2px] after:bg-[var(--primary-color)] after:absolute after:top-[45.5px] ${
        lang == "ar"
          ? alignSecondLine ||
            "after:right-1/2 md:after:translate-x-[0%] after:translate-x-[50%] md:after:right-0"
          : alignSecondLine ||
            "after:right-1/2 md:after:translate-x-[0%] after:translate-x-[50%] md:after:left-0"
      }`}
    >
      <h2
        className={`${fontSize || "text-3xl"} font-bold ${
          color || "text-[var(--main-text-color)]"
        }`}
      >
        {title}
      </h2>
    </div>
  );
});

PageTitle.displayName = "PageTitle";

PageTitle.propTypes = {
  title: PropTypes.string,
  alignSecondLine: PropTypes.string,
  fontSize: PropTypes.string,
  color: PropTypes.string,
};
