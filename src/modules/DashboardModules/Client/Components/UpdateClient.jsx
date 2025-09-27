import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FcEditImage } from "react-icons/fc";
import { Modal } from "../../../../components";
import { useMutate } from "../../../../hooks/useMutate";
import { ClientForm } from "./ClientForm";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Formik } from "formik";

function UpdateClient({ client }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");

  const updateMutation = useMutate({
    endpoint: `clients/update/${client?.id}`,
    method: "POST",
    queryKeysToInvalidate: ["clients"],
  });
  const { mutate } = useMutate({
    method: "POST",
    endpoint: "clients",
    queryKeysToInvalidate: ["clients"],
  });

  const initialValues = {
    user_id: client.id || "",
    name: client.user.name || "",
    country_code: client.user.country_code || "",
    phone: client.user.phone || "",
    email: client.user.email || "",
    password: "",
    password_confirmation: "",
    address: client.address || "",
    financing_type: client.financing_type || "",
    job: client.job || "",
    salary: client.salary || "",
    work_nature: client.work_nature || "",
    nationality: client.nationality || "",
    other_income_sources: client.other_income_sources || "",
    religion: client.religion || "",
    gender: client.gender || "",
    national_id: client.national_id || "",
    has_previous_loan: client.previous_loan_name || client.previous_loan_value ? 1 : 0,
    previous_loan_name: client.previous_loan_name || "",
    previous_loan_value: client.previous_loan_value || "",
  };

  const validationSchema = Yup.object().shape({
    user_id: Yup.string(),
    address: Yup.string(),
    financing_type: Yup.string(),
    job: Yup.string(),
    salary: Yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value),
    work_nature: Yup.string(),
    other_income_sources: Yup.string(),
    national_id: Yup.string(),
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
      if (!client.user?.id) {
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
      console.error("Error updating client:", error);
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
          data-tip={t("edit_client_request")}
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
        <h2 className="text-center text-2xl mb-3">{t("client")}</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnBlur
          validateOnChange
        >
          {({ isSubmitting, errors }) => (
            <ClientForm
              isSubmitting={updateMutation.isPending || isSubmitting}
              // isUpdate={true}
              client={client}
              submitButtonText="save"
              initialValues={initialValues}
              errors={errors}
            />
          )}
        </Formik>
      </div>
    </Modal>
  );
}

UpdateClient.propTypes = {
  client: PropTypes.object,
};

export default UpdateClient;
