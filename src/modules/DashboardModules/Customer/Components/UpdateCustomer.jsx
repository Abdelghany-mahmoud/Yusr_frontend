import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FcEditImage } from "react-icons/fc";
import { Modal } from "../../../../components";
import { useMutate } from "../../../../hooks/useMatute";
import { CustomerForm } from "./CustomerForm";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Formik } from "formik";

function UpdateCustomer({ customer }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");

  const updateMutation = useMutate({
    endpoint: `clients/update/${customer?.id}`,
    method: "POST",
    queryKeysToInvalidate: ["customers"],
  });
  const { mutate, isPending } = useMutate({
    method: "POST",
    endpoint: "clients",
    queryKeysToInvalidate: ["customers"],
  });

  const initialValues = {
    user_id: customer.id || "",
    address: customer.address || "",
    financing_type: customer.financing_type || "",
    job: customer.job || "",
    salary: customer.salary || "",
    work_nature: customer.work_nature || "",
    other_income_sources: customer.other_income_sources || "",
    // nationality: customer.nationality || "",
    // religion: customer.religion || "",
    // gender: customer.gender || "",
    national_id: customer.national_id || "",
    has_previous_loan:
      customer.previous_loan_name || customer.previous_loan_value ? 1 : 0,
    previous_loan_name: customer.previous_loan_name || "",
    previous_loan_value: customer.previous_loan_value || "",
  };

  const validationSchema = Yup.object().shape({
    user_id: Yup.string().required(t("required")),
    address: Yup.string().required(t("required")),
    financing_type: Yup.string().required(t("required")),
    job: Yup.string().required(t("required")),
    salary: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value
      )
      .required(t("required")),
    work_nature: Yup.string(),
    other_income_sources: Yup.string(),
    national_id: Yup.string().required(t("required")),
    has_previous_loan: Yup.boolean(),
    previous_loan_name: Yup.string().when("has_previous_loan", {
      is: 1,
      then: (schema) => schema.required(t("required")),
      otherwise: (schema) => schema.notRequired(),
    }),
    previous_loan_value: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value
      )
      .when("has_previous_loan", {
        is: 1,
        then: (schema) => schema.required(t("required")),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (!customer.user?.id) {
        mutate(values, {
          onSuccess: (response) => {
            toast.success(response?.message);
            setIsOpen(false);
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message || "Error occurred");
            setSubmitting(false);
          },
        });
      } else {
        await updateMutation.mutateAsync(values, {
          onSuccess: (response) => {
            toast.success(response?.message);
            setIsOpen(false);
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message || "Error occurred");
            setSubmitting(false);
          },
        });
      }
    } catch (error) {
      console.error("Error updating customer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={
        <div
          className={"tooltip tooltip-info top"}
          data-tip={t("edit_customer_request")}
        >
          <FcEditImage />
        </div>
      }
      btnClassName={
        "btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      }
      classNameModalStyle={"max-w-[650px] w-full p-3"}
    >
      <div>
        <h2 className="text-center text-2xl mb-3">{t("customer")}</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnBlur
          validateOnChange
        >
          {({ isSubmitting, errors }) => (
            <CustomerForm
              isSubmitting={updateMutation.isPending || isSubmitting}
              // isUpdate={true}
              customer={customer}
              submitButtonText="save"
              errors={errors}
            />
          )}
        </Formik>
      </div>
    </Modal>
  );
}

UpdateCustomer.propTypes = {
  customer: PropTypes.object.isRequired,
};

export default UpdateCustomer;
