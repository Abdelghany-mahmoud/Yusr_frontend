import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FaCalendarPlus } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { InputField, Loading, Modal } from "../../../components";
import { useMutate } from "../../../hooks/useMatute";
import { PropTypes } from "prop-types";

const AddEstimation = ({ transactionId, queryKeyToInvalidate = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");

  const { mutate, isLoading } = useMutate({
    method: "POST",
    endpoint: `transactions/${transactionId}/add-estimation`,
    queryKeysToInvalidate: queryKeyToInvalidate,
  });

  const validationSchema = Yup.object().shape({
    estimation_days: Yup.number()
      .required(t("estimation_days_required"))
      .min(1, t("minimum_day_required")),
  });

  const handleSubmit = (values, { resetForm }) => {
    mutate(values, {
      onSuccess: () => {
        setIsOpen(false);
        resetForm();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnClassName="btn btn-sm btn-ghost text-xl text-primary"
      btnText={
        <div
          className="tooltip tooltip-info top"
          data-tip={t("estimation_days")}
        >
          <FaCalendarPlus />
        </div>
      }
    >
      {/* <h2 className="text-xl font-semibold mb-4">{t("add_estimation_days")}</h2> */}
      <Formik
        initialValues={{ estimation_days: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-4">
          <InputField
            name="estimation_days"
            label={t("estimation_days")}
            type="number"
            placeholder={t("enter_estimation_days")}
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? <Loading /> : t("submit")}
          </button>
        </Form>
      </Formik>
    </Modal>
  );
};

AddEstimation.propTypes = {
  transactionId: PropTypes.string,
  queryKeyToInvalidate: PropTypes.array,
}

export default AddEstimation;
