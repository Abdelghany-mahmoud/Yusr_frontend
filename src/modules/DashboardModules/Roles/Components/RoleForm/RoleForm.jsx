import { Form, Formik } from "formik";
import { Button, InputField } from "../../../../../components";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export const RoleForm = ({
  isPending,
  initialValues,
  onSubmit,
  btnTextSubmit,
}) => {
  const { t } = useTranslation("layout");

  return (
    <Formik
      initialValues={initialValues}
      //   validationSchema={validationSchema(lang)}
      onSubmit={onSubmit}
    >
      <Form className="space-y-4">
        <div>
          <InputField
            name={"name"}
            type={"text"}
            label={t("role_name")}
            placeholder={t("role_name")}
          />
        </div>

        <div className="text-white gap-2">
          <Button
            disabled={isPending}
            type="submit"
            className="font-semibold bg-[var(--primary-color)] w-full transition-all"
            text={btnTextSubmit}
            loading={isPending}
          />
        </div>
      </Form>
    </Formik>
  );
};

RoleForm.propTypes = {
  isPending: PropTypes.bool,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  btnTextSubmit: PropTypes.string,
};
