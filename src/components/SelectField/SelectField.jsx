/* eslint-disable react/prop-types */
import { ErrorMessage, Field } from "formik";
import { useRecoilValue } from "recoil";
import { languageState } from "../../store/langAtom/languageAtom";
import { useTranslation } from "react-i18next";

export const SelectField = ({ name, label, options }) => {
  const lang = useRecoilValue(languageState);
  const { t } = useTranslation("layout");
  return (
    <>
      <label htmlFor={name} className="block text-lg font-medium mb-1">
        {label}
      </label>
      <Field
        as="select"
        id={name}
        name={name}
        className="cursor-pointer text-lg w-full input input-bordered focus:outline-none text-black px-4 py-2 "
      >
        {options.length !== 0 && (
          <option disabled value="">
            {lang === "ar" ? `اختر ${label}` : `Select ${label}`}
          </option>
        )}
        {options.length === 0 ? (
          <option disabled value="">
            {lang === "ar" ? "لا توجد خيارات !" : "No Options!"}
          </option>
        ) : (
          options.map((option) => (
            <option
              className="capitalize text-lg"
              key={option.id}
              value={option.id}
            >
              {t(option.name)}
            </option>
          ))
        )}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </>
  );
};
